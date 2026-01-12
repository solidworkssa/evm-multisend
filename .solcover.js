module.exports = {
    norpc: true,
    testCommand: 'npm test',
    compileCommand: 'npm run compile',
    skipFiles: [
        'test/',
        'mock/',
        'MockERC20.sol',
        'MaliciousReceiver.sol'
    ],
    mocha: {
        fgrep: '[skip-on-coverage]',
        invert: true
    }
};
