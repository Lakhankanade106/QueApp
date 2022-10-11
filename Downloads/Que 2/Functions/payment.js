import { Router } from 'express';
import { addCard } from './addCard';

export const paymentsRouter = Router();

paymentsRouter.post(
    '/add-card',
    (req, res, next) =>
        addCard(req)
            .then(data => res.json(data))
            .catch(next),
);