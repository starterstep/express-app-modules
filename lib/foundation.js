var color = {
    white: "#FFFFFF",

    lightRed: "#f47a65",
    red: "#f04124",
    darkRed: "#CF2A0E",

    lightGreen: "#9BB184",
    green: "#709050",
    darkGreen: "#368A55",

    lightGold: "#FFEE4E",
    gold: "#f3bb1b",
    darkGold: "#C08800",

    lightOrange: "#f3a14f",
    orange: "#f08a24",
    darkOrange: "#c06e1c",

    lightestGray: "#f3f3f3",
    lightGray: "#e7e7e7",
    gray: "#cccccc",
    darkGray: "#999999",
    darkestGray: "#555555",

    lightestBlue: "#75b8ea",
    lightBlue: "#2199e8",
    blue: "#147cc0",
    darkBlue: "#00527A",
    darkestBlue: "#014368",

    black: "#333333",
    purple: "#551A8B"
};

var appColor = {
    primary: color.lightBlue,
    primarySelected: color.blue,
    secondary: color.gold,
    secondarySelected: color.darkGold,
    alert: color.red,
    alertSelected: color.darkRed,
    success: color.green,
    successSelected: color.darkGreen,
    warning: color.orange,
    warningSelected: color.darkOrange,
    info: color.lightBlue,
    infoSelected: color.blue
};

color = _.extend(appColor, color);

var fontSize = {
    tiny: 10,
    small: 12,
    medium: 14,
    large: 18,
    big: 24,
    huge: 32
};

var height = {
    tiny: 10,
    little: 20,
    small: 30,
    medium: 40,
    large: 60,
    big: 80,
    huge: 100
};

var width = {
    tiny: 10,
    little: 20,
    small: 30,
    medium: 40,
    large: 60,
    big: 80,
    huge: 100
};

var primary = {
    font: {
        fontFamily: 'HelveticaNeue',
        fontSize: fontSize.medium
    }
};

var position = {
    tiny: 5,
    tinyPercent: '5%',
    little: 10,
    littlePercent: '10%',
    small: 15,
    smallPercent: '15%',
    medium: 20,
    mediumPercent: '20%',
    large: 30,
    largePercent: '30%',
    big: 40,
    bigPercent: '40%',
    huge: 50,
    hugePercent: '50%'
};

var border = {
    radius: {
        tiny: 1,
        small: 3,
        medium: 5,
        large: 7,
        big: 9,
        huge: 12
    },
    round: {
        tiny: height.tiny / 2,
        small: height.small / 2,
        medium: height.medium / 2,
        large: height.large / 2,
        big: height.big / 2,
        huge: height.huge / 2
    },
    width: {
        tiny: 1,
        small: 2,
        medium: 3,
        large: 4,
        big: 5,
        huge: 6
    },
    color: color.gray
};

module.exports = {
    defaults: {
        primary: primary,
        position: position,
        border: border,
        color: color,
        height: height,
        width: width,
        fontSize: fontSize
    },
    options: {
        tabs: {
            selectedBackgroundColor: color.white
        },
        subNav: {
            selectedBackgroundColor: color.primary,
            useNormalWidth: true
        },
        iconBar: {
            selectedBackgroundColor: color.primary
        }
    }
};