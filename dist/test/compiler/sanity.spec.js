(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "ava", "../helpers/assert", "../../src/compiler"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ava_1 = require("ava");
    var assert_1 = require("../helpers/assert");
    var compiler_1 = require("../../src/compiler");
    // The compiler...
    ava_1.default('compiles an empty string to an empty string', function (t) {
        var code = compiler_1.default('', false, true);
        t.deepEqual(code, '');
    });
    ava_1.default('compiles the example SpitScript program', function (t) {
        var ss = "\n    big pusher\n    lil bruh be hot, got lotta that stuff\n    \n    bruh he with nothin, yeah be nothin\n    bruh he with the cool one, yeah be the fool one\n    \n    rollin these pusher be two uh pusher, under 10 uh pusher got bigger bigger well then\n    \n    bruh he with the pusher, yeah be bruh with the pusher, he smaller than two yeah bigger than bruh with the pusher, smaller than one, yeah\n    \n    console get log got this bruh with the pusher, yeah well\n    okay    \n    ";
        var code = compiler_1.default(ss, false, true) || '';
        var expectedCode = "var pusher\n    var bruh = []\n    \n    bruh[0] = 0\n    bruh[1] = 1\n    \n    for (pusher = 2;pusher <= 10;pusher++){\n    \n    bruh[pusher] = bruh[pusher-2]+bruh[pusher-1]\n    \n    console.log(bruh[pusher])\n    }";
        assert_1.default.codeEquals(t, code, expectedCode);
    });
    ava_1.default('compiles the quote-escaping example program', function (t) {
        var ss = "\n    console get log this 'Elmo\\'s world' well\n    ";
        var code = compiler_1.default(ss, false, true) || '';
        var expectedCode = "\n    console.log('Elmo\\'s world')\n    ";
        assert_1.default.codeEquals(t, code, expectedCode);
    });
});
//# sourceMappingURL=sanity.spec.js.map