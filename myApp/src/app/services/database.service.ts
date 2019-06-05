import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Track {
    id: number,
    positionId: number,
    date: Date,
    trainingId: number
}

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {
    private database: SQLiteObject;
    private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
    http: HttpClient;
    sqlite: SQLite;
    sqlitePorter: SQLitePorter;
    plt: Platform;
    trackings = new BehaviorSubject([]);

    constructor() {
        this.sqlite = new SQLite();
        this.sqlite.create({
            name: 'trackings.db',
            location: 'default'
        })
            .then((db: SQLiteObject) => {
                this.database = db;
                this.seedDatabase();
            });
    }

    seedDatabase() {
        this.http.get('data/CreateDB.sql', { responseType: 'text'})
            .subscribe(sql => {
                this.dbReady.next(true);
                this.sqlitePorter.importSqlToDb(this.database, sql)
                    .then(() => {
                        this.dbReady.next(true);
                        this.loadTrackings().then(() => {
                            this.dbReady.next(true);
                        });
                    })
                    .catch(e => console.error(e));
            });
    }

    getDatabaseState() {
        return this.dbReady.asObservable();
    }

    getTracks(): Observable<Track[]> {
        return this.trackings.asObservable();
    }

    loadTrackings() {
        return this.database.executeSql('SELECT * FROM trackings', []).then(data => {
            let trackings: Track[] = [];

            if (data.rows.length > 0) {
                for (let i = 0; i < data.rows.length; i++) {
                    let skills = [];
                    if (data.rows.item(i).skills != '') {
                        skills = JSON.parse(data.rows.item(i).skills);
                    }

                    trackings.push({
                        id: data.rows.item(i).id,
                        positionId: data.rows.item(i).positionId,
                        date: data.rows.item(i).date,
                        trainingId: data.rows.item(i).trainingId
                    });
                }
            }
            this.trackings.next(trackings);
        });
    }
}