// placement changed to array of numbers
// added shape property
export const BOX_ROWS = 20;
export const BOX_COLUMNS = 10;
export const TILE_SIZE = 30;
export const HEART_TIME = 25;
export const START_SPEED = 1/(1000/60);
export const RISE_SPEED_COEFF = 0.25;

export const tetrominoesData = [
    // 1) The long one
    {
        shape: 'I',
        color: "red",
        colorCodes: ["#d92327", "#ff4245", "#a61b1e", "#9c191c"],
        placement: [[true, true, true, true]],
        rows: 1,
        columns: 4,
        height: "120px",
        width: "30px",
        fullTetrominoSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 30"><path d="M2.9 2.9h25v25h-25z" style="fill:#d92327;fill-opacity:1;stroke-width:.17016"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#ff4245;fill-opacity:1;stroke-width:.264583"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#a61b1e;fill-opacity:1;stroke-width:.264583"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#9c191c;fill-opacity:1;stroke-width:.264583"/><path d="M2.9 2.9h25v25h-25z" style="fill:#d92327;fill-opacity:1;stroke-width:.17016" transform="translate(30)"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#ff4245;fill-opacity:1;stroke-width:.264583" transform="translate(30)"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#a61b1e;fill-opacity:1;stroke-width:.264583" transform="translate(30)"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#9c191c;fill-opacity:1;stroke-width:.264583" transform="translate(30)"/><path d="M2.9 2.9h25v25h-25z" style="fill:#d92327;fill-opacity:1;stroke-width:.17016" transform="translate(60)"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#ff4245;fill-opacity:1;stroke-width:.264583" transform="translate(60)"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#a61b1e;fill-opacity:1;stroke-width:.264583" transform="translate(60)"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#9c191c;fill-opacity:1;stroke-width:.264583" transform="translate(60)"/><path d="M2.9 2.9h25v25h-25z" style="fill:#d92327;fill-opacity:1;stroke-width:.17016" transform="translate(90)"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#ff4245;fill-opacity:1;stroke-width:.264583" transform="translate(90)"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#a61b1e;fill-opacity:1;stroke-width:.264583" transform="translate(90)"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#9c191c;fill-opacity:1;stroke-width:.264583" transform="translate(90)"/></svg>',
    },
    // 2) The square
    {
        shape: 'O',
        color: "yellow",
        colorCodes: ["#fed304", "#fedf41", "#cca903", "#c2a103"],
        placement: [
            [true, true],
            [true, true]
        ],
        rows: 2,
        columns: 2,
        height: "60px",
        width: "60px",
        fullTetrominoSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60"><path d="M2.9 2.9h25v25h-25z" style="fill:#fed304;fill-opacity:1;stroke-width:.17016"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#fee068;fill-opacity:1;stroke-width:.264583"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#cca903;fill-opacity:1;stroke-width:.264583"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#c2a103;fill-opacity:1;stroke-width:.264583"/><path d="M2.9 2.9h25v25h-25z" style="fill:#fed304;fill-opacity:1;stroke-width:.17016" transform="translate(0 30)"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#fee068;fill-opacity:1;stroke-width:.264583" transform="translate(0 30)"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#cca903;fill-opacity:1;stroke-width:.264583" transform="translate(0 30)"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#c2a103;fill-opacity:1;stroke-width:.264583" transform="translate(0 30)"/><path d="M2.9 2.9h25v25h-25z" style="fill:#fed304;fill-opacity:1;stroke-width:.17016" transform="translate(30)"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#fee068;fill-opacity:1;stroke-width:.264583" transform="translate(30)"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#cca903;fill-opacity:1;stroke-width:.264583" transform="translate(30)"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#c2a103;fill-opacity:1;stroke-width:.264583" transform="translate(30)"/><path d="M2.9 2.9h25v25h-25z" style="fill:#fed304;fill-opacity:1;stroke-width:.17016" transform="translate(30 30)"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#fee068;fill-opacity:1;stroke-width:.264583" transform="translate(30 30)"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#cca903;fill-opacity:1;stroke-width:.264583" transform="translate(30 30)"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#c2a103;fill-opacity:1;stroke-width:.264583" transform="translate(30 30)"/></svg>',
    },
    // 3) The small "T"
    {
        shape: 'T',
        color: "pink",
        colorCodes: ["#eb85b6", "#ffa3cf", "#b8688e", "#ad6186"],
        placement: [
            [false, true, false],
            [true, true, true]
        ],
        rows: 2,
        columns: 3,
        height: "60px",
        width: "90px",
        fullTetrominoSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 60"><path d="M2.9 2.9h25v25h-25z" style="fill:#eb85b6;fill-opacity:1;stroke-width:.17016" transform="translate(30)"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#ffa3cf;fill-opacity:1;stroke-width:.264583" transform="translate(30)"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#b8688e;fill-opacity:1;stroke-width:.264583" transform="translate(30)"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#ad6186;fill-opacity:1;stroke-width:.264583" transform="translate(30)"/><path d="M2.9 2.9h25v25h-25z" style="fill:#eb85b6;fill-opacity:1;stroke-width:.17016" transform="translate(30 30)"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#ffa3cf;fill-opacity:1;stroke-width:.264583" transform="translate(30 30)"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#b8688e;fill-opacity:1;stroke-width:.264583" transform="translate(30 30)"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#ad6186;fill-opacity:1;stroke-width:.264583" transform="translate(30 30)"/><path d="M2.9 2.9h25v25h-25z" style="fill:#eb85b6;fill-opacity:1;stroke-width:.17016" transform="translate(0 30)"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#ffa3cf;fill-opacity:1;stroke-width:.264583" transform="translate(0 30)"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#b8688e;fill-opacity:1;stroke-width:.264583" transform="translate(0 30)"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#ad6186;fill-opacity:1;stroke-width:.264583" transform="translate(0 30)"/><path d="M2.9 2.9h25v25h-25z" style="fill:#eb85b6;fill-opacity:1;stroke-width:.17016" transform="translate(60 30)"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#ffa3cf;fill-opacity:1;stroke-width:.264583" transform="translate(60 30)"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#b8688e;fill-opacity:1;stroke-width:.264583" transform="translate(60 30)"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#ad6186;fill-opacity:1;stroke-width:.264583" transform="translate(60 30)"/></svg>',
    },
    // 4) The "L"
    {
        shape: 'L',
        color: "green",
        colorCodes: ["#1fa054", "#53bb6c", "#156e3a", "#166636"],
        placement: [
            [false, false, true],
            [true, true, true]
        ],
        rows: 2,
        columns: 3,
        height: "60px",
        width: "90px",
        fullTetrominoSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 60"><path d="M2.9 2.9h25v25h-25z" style="fill:#1fa054;fill-opacity:1;stroke-width:.17016" transform="translate(60)"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#53bb6c;fill-opacity:1;stroke-width:.264583" transform="translate(60)"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#156e3a;fill-opacity:1;stroke-width:.264583" transform="translate(60)"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#166636;fill-opacity:1;stroke-width:.264583" transform="translate(60)"/><path d="M2.9 2.9h25v25h-25z" style="fill:#1fa054;fill-opacity:1;stroke-width:.17016" transform="translate(0 30)"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#53bb6c;fill-opacity:1;stroke-width:.264583" transform="translate(0 30)"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#156e3a;fill-opacity:1;stroke-width:.264583" transform="translate(0 30)"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#166636;fill-opacity:1;stroke-width:.264583" transform="translate(0 30)"/><path d="M2.9 2.9h25v25h-25z" style="fill:#1fa054;fill-opacity:1;stroke-width:.17016" transform="translate(30 30)"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#53bb6c;fill-opacity:1;stroke-width:.264583" transform="translate(30 30)"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#156e3a;fill-opacity:1;stroke-width:.264583" transform="translate(30 30)"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#166636;fill-opacity:1;stroke-width:.264583" transform="translate(30 30)"/><path d="M2.9 2.9h25v25h-25z" style="fill:#1fa054;fill-opacity:1;stroke-width:.17016" transform="translate(60 30)"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#53bb6c;fill-opacity:1;stroke-width:.264583" transform="translate(60 30)"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#156e3a;fill-opacity:1;stroke-width:.264583" transform="translate(60 30)"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#166636;fill-opacity:1;stroke-width:.264583" transform="translate(60 30)"/></svg>',
    },
    // 5) The reverse "L"
    {
        shape: 'J',
        color: "brown",
        colorCodes: ["#5c4133", "#8f654f", "#291d17", "#211712"],
        placement: [
            [true, false, false],
            [true, true, true]
        ],
        rows: 2,
        columns: 3,
        height: "60px",
        width: "90px",
        fullTetrominoSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 60"><path d="M2.9 2.9h25v25h-25z" style="fill:#5c4133;fill-opacity:1;stroke-width:.17016"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#8f654f;fill-opacity:1;stroke-width:.264583"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#291d17;fill-opacity:1;stroke-width:.264583"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#211712;fill-opacity:1;stroke-width:.264583"/><path d="M2.9 2.9h25v25h-25z" style="fill:#5c4133;fill-opacity:1;stroke-width:.17016" transform="translate(0 30)"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#8f654f;fill-opacity:1;stroke-width:.264583" transform="translate(0 30)"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#291d17;fill-opacity:1;stroke-width:.264583" transform="translate(0 30)"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#211712;fill-opacity:1;stroke-width:.264583" transform="translate(0 30)"/><path d="M2.9 2.9h25v25h-25z" style="fill:#5c4133;fill-opacity:1;stroke-width:.17016" transform="translate(30 30)"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#8f654f;fill-opacity:1;stroke-width:.264583" transform="translate(30 30)"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#291d17;fill-opacity:1;stroke-width:.264583" transform="translate(30 30)"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#211712;fill-opacity:1;stroke-width:.264583" transform="translate(30 30)"/><path d="M2.9 2.9h25v25h-25z" style="fill:#5c4133;fill-opacity:1;stroke-width:.17016" transform="translate(60 30)"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#8f654f;fill-opacity:1;stroke-width:.264583" transform="translate(60 30)"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#291d17;fill-opacity:1;stroke-width:.264583" transform="translate(60 30)"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#211712;fill-opacity:1;stroke-width:.264583" transform="translate(60 30)"/></svg>',
    },
    // 6) The "S"
    {
        shape: 'S',
        color: "blue",
        colorCodes: ["#39a8a3", "#4adbd5", "#287572", "#256e6b"],
        placement: [
            [false, true, true],
            [true, true, false]
        ],
        rows: 2,
        columns: 3,
        height: "60px",
        width: "90px",
        fullTetrominoSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 60"><path d="M2.9 2.9h25v25h-25z" style="fill:#39a8a3;fill-opacity:1;stroke-width:.17016" transform="translate(30)"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#4adbd5;fill-opacity:1;stroke-width:.264583" transform="translate(30)"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#287572;fill-opacity:1;stroke-width:.264583" transform="translate(30)"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#256e6b;fill-opacity:1;stroke-width:.264583" transform="translate(30)"/><path d="M2.9 2.9h25v25h-25z" style="fill:#39a8a3;fill-opacity:1;stroke-width:.17016" transform="translate(0 30)"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#4adbd5;fill-opacity:1;stroke-width:.264583" transform="translate(0 30)"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#287572;fill-opacity:1;stroke-width:.264583" transform="translate(0 30)"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#256e6b;fill-opacity:1;stroke-width:.264583" transform="translate(0 30)"/><path d="M2.9 2.9h25v25h-25z" style="fill:#39a8a3;fill-opacity:1;stroke-width:.17016" transform="translate(30 30)"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#4adbd5;fill-opacity:1;stroke-width:.264583" transform="translate(30 30)"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#287572;fill-opacity:1;stroke-width:.264583" transform="translate(30 30)"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#256e6b;fill-opacity:1;stroke-width:.264583" transform="translate(30 30)"/><path d="M2.9 2.9h25v25h-25z" style="fill:#39a8a3;fill-opacity:1;stroke-width:.17016" transform="translate(60)"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#4adbd5;fill-opacity:1;stroke-width:.264583" transform="translate(60)"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#287572;fill-opacity:1;stroke-width:.264583" transform="translate(60)"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#256e6b;fill-opacity:1;stroke-width:.264583" transform="translate(60)"/></svg>',
    },
    // 7) The reverse "S"
    {
        shape: 'Z',
        color: "purple",
        colorCodes: ["#7e3d97", "#955aa4", "#532963", "#4a2459"],
        placement: [
            [true, true, false],
            [false, true, true]
        ],
        rows: 2,
        columns: 3,
        height: "60px",
        width: "90px",
        fullTetrominoSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 60"><path d="M2.9 2.9h25v25h-25z" style="fill:#7e3d97;fill-opacity:1;stroke-width:.17016"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#955aa4;fill-opacity:1;stroke-width:.264583"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#532963;fill-opacity:1;stroke-width:.264583"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#4a2459;fill-opacity:1;stroke-width:.264583"/><path d="M2.9 2.9h25v25h-25z" style="fill:#7e3d97;fill-opacity:1;stroke-width:.17016" transform="translate(30)"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#955aa4;fill-opacity:1;stroke-width:.264583" transform="translate(30)"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#532963;fill-opacity:1;stroke-width:.264583" transform="translate(30)"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#4a2459;fill-opacity:1;stroke-width:.264583" transform="translate(30)"/><path d="M2.9 2.9h25v25h-25z" style="fill:#7e3d97;fill-opacity:1;stroke-width:.17016" transform="translate(30 30)"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#955aa4;fill-opacity:1;stroke-width:.264583" transform="translate(30 30)"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#532963;fill-opacity:1;stroke-width:.264583" transform="translate(30 30)"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#4a2459;fill-opacity:1;stroke-width:.264583" transform="translate(30 30)"/><path d="M2.9 2.9h25v25h-25z" style="fill:#7e3d97;fill-opacity:1;stroke-width:.17016" transform="translate(60 30)"/><path d="M0 0v30l3-3V3h24l3-3z" style="fill:#955aa4;fill-opacity:1;stroke-width:.264583" transform="translate(60 30)"/><path d="M30 0v30H0l3-3h24V3Z" style="fill:#532963;fill-opacity:1;stroke-width:.264583" transform="translate(60 30)"/><path d="M0 30v-1h1v-1h1v-1h1v1H2v1H1v1zM27 3V2h1V1h1V0h1v1h-1v1h-1v1z" style="fill:#4a2459;fill-opacity:1;stroke-width:.264583" transform="translate(60 30)"/></svg>',
    },

];

export const responseTexts = {
    "zero": ["Warm-up?", "Oops!"],
    "low": ["Not bad!", "Keep going!", "Nice try!"],
    "medium": ["Well done!", "Great job!", "Solid work!"],
    "high": ["Unstoppable!", "Excellent work!"],
};

export const gameOverTextTemp = "{responseText} You've scored {score} points, ranking at position #{rank} on scoreboard, which puts you in the top {percentile}% of all players.";