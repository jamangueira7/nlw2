import {Request, Response} from "express";
import db from "../database/connection";
import convertHourToMinutes from "../utils/convertHourToMinutes";

interface SheduleItem {
    week_day: number,
    from: string,
    to: string,
}

export default class ClassesController {
    async index (request: Request, response: Response) {
        const filters = request.query;

        const subject = filters.subject as string;
        const week_day = filters.week_day as string;
        const time = filters.time as string;

        if(!filters.week_day || !filters.subject || !filters.time){
            return response.status(400).json({
               error: 'Missing filters to search classes'
            });
        }

        const timeInMinutes = convertHourToMinutes(time);

        const classes = await db('classes')
            .whereExists(function () {
                this.select('class_schedule.*')
                    .from('class_schedule')
                    .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                    .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
                    .whereRaw('`class_schedule`.`from` <= ??', [Number(timeInMinutes)])
                    .whereRaw('`class_schedule`.`to` > ??', [Number(timeInMinutes)])
            })
            .where('classes.subject', '=', subject)
            .join('users', 'classes.user_id', '=', 'users.id')
            .select(['classes.*', 'users.*']);

        return response.json(classes);
    }
    async create (request: Request, response: Response) {
            const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = request.body;

        const trx = await db.transaction();

        try {
            const insertUsersIds = await trx('users').insert({
                name,
                avatar,
                whatsapp,
                bio,
            });

            const user_id = insertUsersIds[0];

            const insertClassesIds = await trx('classes').insert({
                subject,
                cost,
                user_id

            });

            const class_id = insertClassesIds[0];

            const classSchedule = schedule.map((sheduleItem: SheduleItem) => {
                return {
                    class_id,
                    week_day: sheduleItem.week_day,
                    from: convertHourToMinutes(sheduleItem.from),
                    to: convertHourToMinutes(sheduleItem.to),
                };
            });

            await trx('class_schedule').insert(classSchedule);

            await trx.commit();

            return response.status(201).send();

        }catch (err) {

            await trx.rollback();
            return response.status(400).json({
                error: 'Unexpected error while creating new class'
            });
        }
    }
}