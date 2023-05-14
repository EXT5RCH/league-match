const STDOUT_CYCLE = 50;

const leagueMatch = (teamsCount) => {
  const maxNumberOfDigits = (teamsCount - 1).toString().length;
  const table = new Array(teamsCount)
    .fill()
    .map((_) =>
      new Array(teamsCount)
        .fill()
        .map((_) => "".padStart(maxNumberOfDigits, " "))
    );
  const totalSection = teamsCount % 2 ? teamsCount + 1 : teamsCount;
  for (let section = 1; section < totalSection; section++) {
    strSection = section.toString().padStart(maxNumberOfDigits, " ");
    let team1 = 0;
    let team2 = section;
    const baseTeamNo = team2;
    if (section < teamsCount) {
      table[team1][team2] = strSection;
      table[team2][team1] = strSection;
    }
    const remainingTeamsCount = totalSection - 2;
    for (let i = 0; i < remainingTeamsCount / 2; i++) {
      team1 =
        baseTeamNo + 1 + i > totalSection - 1
          ? baseTeamNo + 2 + i - totalSection
          : baseTeamNo + 1 + i;
      team2 =
        baseTeamNo + remainingTeamsCount - i > totalSection - 1
          ? baseTeamNo + remainingTeamsCount - i - totalSection + 1
          : baseTeamNo + remainingTeamsCount - i;
      if (Math.max(team1, team2) < teamsCount) {
        table[team1][team2] = strSection;
        table[team2][team1] = strSection;
      }
    }
  }
  return table;
};

const validation = (argv) => {
  if (argv.length < 3 || argv.length > 4) {
    console.log("wrong number of arguments.");
    console.log("command: node index [team_count] [--stream]");
    return false;
  }
  const parsed = Number(argv[2]);
  if (isNaN(parsed)) {
    console.log("[team_count] is number.");
    console.log("command: node index [team_count] [--stream]");
    return false;
  }
  if (parsed < 2) {
    console.log("[team_count] is 2 or more.");
    console.log("command: node index [team_count] [--stream]");
    return false;
  }
  if (argv.length === 4 && argv[3] !== "--stream") {
    console.log("invalid argument.");
    console.log("command: node index [team_count] [--stream]");
    return false;
  }
  return true;
};

const stdout = (table, startTime, stream) => {
  if (stream) {
    let textMessage = "";
    table.forEach((row) => {
      textMessage += row.join("|");
      textMessage += `\n`;
    });
    const messages = textMessage.split("");
    const timerId = setInterval(() => {
      const char = messages.shift();
      if (!messages.length) {
        setTimeout(() => {
          console.log();
          console.log(`Finish: ${performance.now() - startTime}ms`);
        }, STDOUT_CYCLE);
        clearInterval(timerId);
      }
      process.stdout.write(char);
    }, STDOUT_CYCLE);
  } else {
    console.log(table.map((row) => row.join("|")).join("\n"));
    console.log();
    console.log(`Finish: ${performance.now() - startTime}ms`);
  }
};

(() => {
  const startTime = performance.now();
  const argv = process.argv;
  if (!validation(argv)) return;
  const teamsCount = Number(argv[2]);
  const stream = argv.length === 4 && argv[3] == "--stream";
  const table = leagueMatch(teamsCount);
  stdout(table, startTime, stream);
})();
