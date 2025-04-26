export interface NutrientData {
    _id?: string;
    userId: string;
    date: Date;
    nutrients: {
        proteins: number;
        carbs: number;
        fats: number;
        vitaminC: number;
        calcium: number;
        iron: number;
    }
}

export interface NutrientDataResponse {
    data: NutrientData[];
    message: string;
}
