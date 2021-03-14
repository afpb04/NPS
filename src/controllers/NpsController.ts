import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { AppError } from "../errors/AppError";
import SurveyUsersRepository from "../repositories/SurveysUsersRepository";


class NpsController {
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const surveysUsersRepository = getCustomRepository(SurveyUsersRepository);

    const survetsUsers = await surveysUsersRepository.find({
      survey_id,
      value: Not(IsNull()),
    });

    if (!survetsUsers) {
      throw new AppError('Survey does not exists!');
    }

    const detractor = survetsUsers.filter(
      (survey) => (survey.value >= 0 && survey.value <= 6)
    ).length;

    const promoters = survetsUsers.filter(
      (survey) => (survey.value >= 9 && survey.value <= 10)
    ).length;

    const passive = survetsUsers.filter(
      (survey) => (survey.value >= 7 && survey.value <= 8)
    ).length;

    const totalAnswers = survetsUsers.length;

    const calculate = Number((((promoters - detractor) / totalAnswers) * 100).toFixed(2));

    return response.json({
      detractor,
      promoters,
      passive,
      totalAnswers,
      nps: calculate
    })

  }

}
export default NpsController;
