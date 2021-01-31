import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {StatisticsFilterType} from "../constants";
dayjs.extend(duration);

export const getRank = (filmCount) => {
  if (filmCount > 20) {
    return `Movie Buff`;
  }

  if (filmCount > 10) {
    return `Fan`;
  }

  if (filmCount > 1) {
    return `Novice`;
  }

  return ``;
};

export const getTotalDuration = (films) => {
  const totalDuration = films.reduce((accumulator, film) => accumulator + film.duration, 0);
  const hours = dayjs.duration(totalDuration, `m`).hours();
  const minutes = dayjs.duration(totalDuration, `m`).minutes();

  return {hours, minutes};
};

export const getGenresStats = (films) => {
  const genresStats = {};

  films
    .reduce((accumulator, film) => accumulator.concat(film.genres), [])
    .forEach((genre) => {
      if (genresStats[genre]) {
        genresStats[genre]++;
        return;
      }
      genresStats[genre] = 1;
    });

  return genresStats;
};

export const getTopGenre = (films) => {
  if (films.length === 0) {
    return ``;
  }

  const genresStats = getGenresStats(films);
  return Object.entries(genresStats).sort((a, b) => b[1] - a[1])[0][0];
};

export const filter = {
  [StatisticsFilterType.ALL]: (films) => films,
  [StatisticsFilterType.TODAY]: (films) => films.filter((film) => dayjs(film.watchingDate).isAfter(dayjs().subtract(1, `day`))),
  [StatisticsFilterType.WEEK]: (films) => films.filter((film) => dayjs(film.watchingDate).isAfter(dayjs().subtract(1, `week`))),
  [StatisticsFilterType.MONTH]: (films) => films.filter((film) => dayjs(film.watchingDate).isAfter(dayjs().subtract(1, `month`))),
  [StatisticsFilterType.YEAR]: (films) => films.filter((film) => dayjs(film.watchingDate).isAfter(dayjs().subtract(1, `year`)))
};
