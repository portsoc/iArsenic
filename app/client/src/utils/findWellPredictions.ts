import { Prediction, Well } from 'iarsenic-types';

export default function(well: Well, predictions: Prediction[]): Prediction[] {
    const matching = predictions
        .filter(p => p.wellId === well.id)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // latest first

    if (matching.length === 0) {
        return [];
    }

    return matching;
}
