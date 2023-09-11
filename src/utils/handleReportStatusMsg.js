function handleReportGenStatusMsg(msg) {
  function generateIndent(branch) {
    const figureSpace = '\u2007'; // FIGURE SPACE
    const pipe = '│';
    if (branch) {
      return branch === 'last'
        ? figureSpace.repeat(3)
        : `${pipe}${figureSpace.repeat(2)}`;
    } else return '';
  }
  const { name, type, branch0 = '', branch1 = '' } = msg;
  const heading = type === 'middle' ? '├──' : '└──';
  const branch =
    generateIndent(branch0) + generateIndent(branch1) + heading + name;
  return branch;
}

export default handleReportGenStatusMsg;
