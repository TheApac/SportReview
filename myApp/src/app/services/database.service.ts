import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Track {
    id: number;
    positionId: number;
    date: Date;
    trainingId: number;
}

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {
    private database: SQLiteObject;
    private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
    sqlite: SQLite;
    trackings = new BehaviorSubject([]);

    constructor(public http: HttpClient) {
        this.sqlite = new SQLite();
        this.sqlite.create({
            name: 'trackings.db',
            location: 'default'
        }).then((db: SQLiteObject) => {
                this.database = db;
                this.seedDatabase();
            });
    }

    seedDatabase() {
        this.http.get('./assets/CreateDB.sql', { responseType: 'text'}).subscribe(async (sql) => {
            const requests = sql.split(';');
            for (const element of requests) {
                await this.database.executeSql(element, []).then(() => {
                }).catch(e => console.log('ERROR EXEC : ' + JSON.stringify(e)));
            }
            await this.loadTrackings().then(() => {
                this.dbReady.next(true);
            }).catch(e => console.log('ERROR LOAD' + JSON.stringify(e)));
        });
    }

    getDatabaseState() {
        return this.dbReady.asObservable();
    }

    getTracks(): Observable<Track[]> {
        return this.trackings.asObservable();
    }

    loadTrackings() {
        return this.database.executeSql('SELECT * FROM tracking', []).then(data => {
            const trackings: Track[] = [];
            for (let i = 0; i < data.rows.length; i++) {
                trackings.push({
                    id: data.rows.item(i).id,
                    positionId: data.rows.item(i).positionId,
                    date: data.rows.item(i).date,
                    trainingId: data.rows.item(i).trainingId
                });
            }
            this.trackings.next(trackings);
        }).catch((e) => {
            console.log('ERROR LOADING' + JSON.stringify(e));
        });
    }
}
