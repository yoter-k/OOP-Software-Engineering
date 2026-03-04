// npm install axios cheerio
//
//

const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const url = 'https://www.basketball-reference.com/leagues/NBA_2025_standings.html';

async function parseNBA() {
  try {
    const response = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const html = response.data;
    const $ = cheerio.load(html);
    const allTeams = [];

    let csv = 'conference,team,wins,losses,pct,gb,ps,pa,srs\n';

    csv += 'Eastern Conference\n';
    $('#confs_standings_E tr').each((i, el) => {
      const team = $(el).find('th[data-stat="team_name"] a').text().trim();
      if (!team) return;

      const wins = $(el).find('td[data-stat="wins"]').text().trim();
      const losses = $(el).find('td[data-stat="losses"]').text().trim();
      const pct = $(el).find('td[data-stat="win_loss_pct"]').text().trim();
      const gb = $(el).find('td[data-stat="gb"]').text().trim();
      const ps = $(el).find('td[data-stat="pts_per_g"]').text().trim();
      const pa = $(el).find('td[data-stat="opp_pts_per_g"]').text().trim();
      const srs = $(el).find('td[data-stat="srs"]').text().trim();

      csv += `,${team},${wins},${losses},${pct},${gb},${ps},${pa},${srs}\n`;

      allTeams.push({
        conference: 'East',
        team, wins, losses, pct, gb, ps, pa, srs
      });
    });

    csv += '\nWestern Conference\n';
    $('#confs_standings_W tr').each((i, el) => {
      const team = $(el).find('th[data-stat="team_name"] a').text().trim();
      if (!team) return;

      const wins = $(el).find('td[data-stat="wins"]').text().trim();
      const losses = $(el).find('td[data-stat="losses"]').text().trim();
      const pct = $(el).find('td[data-stat="win_loss_pct"]').text().trim();
      const gb = $(el).find('td[data-stat="gb"]').text().trim();
      const ps = $(el).find('td[data-stat="pts_per_g"]').text().trim();
      const pa = $(el).find('td[data-stat="opp_pts_per_g"]').text().trim();
      const srs = $(el).find('td[data-stat="srs"]').text().trim();

      csv += `,${team},${wins},${losses},${pct},${gb},${ps},${pa},${srs}\n`;

      allTeams.push({
        conference: 'West',
        team, wins, losses, pct, gb, ps, pa, srs
      });
    });

    fs.writeFileSync('nba2025_standings.csv', csv, 'utf8');
    fs.writeFileSync('nba2025_standings.json', JSON.stringify(allTeams, null, 2), 'utf8');

    console.log('Готово');
  } catch (err) {
    console.log('Ошибка:', err.message);
  }
}

parseNBA();
