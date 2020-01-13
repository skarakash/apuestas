const teamsStyles = {
    width: 400,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'inline-block',
    verticalAlign: 'middle'
};

const scoreStyles = {
    display: 'inline-block',
    verticalAlign: 'middle',
    marginRight: 30
};

const buttonStyles = {
    // marginRight: 50,
    // width: 40,
    overflow: 'hidden'
};

const oddsStyles = {
    display: 'inline-block',
    // marginRight: 25
};

const oddButton = {
  height: 30,
  width: 55
};

const probabilityStyles = {
    display: 'inline-block',
    marginRight: 25,
    verticalAlign: 'middle'
};

const probabilityStylesHigh = {
    display: 'inline-block',
    marginRight: 25,
    verticalAlign: 'middle',
    backgroundColor: 'green',
    color: 'white'
};


const pStylesHigh ={
    backgroundColor: 'green',
    color: 'white'
};

const inplayWrapperStyles = {
  display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center'
};

const inplayWrapperStylesBet = {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'lightgreen'
}

module.exports = {
    teamsStyles,
    scoreStyles,
    buttonStyles,
    oddsStyles,
    oddButton,
    probabilityStyles,
    probabilityStylesHigh,
    pStylesHigh,
    inplayWrapperStyles,
    inplayWrapperStylesBet,
};