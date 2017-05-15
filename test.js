/**
 * 字符串全排列（去重）
 *
 * @param  {string} string 字符串
 * @return {Array}        全排列数组
 */
function solution(string) {

    var res = [];
    var stringArr = string.split('');
    var tmpArr = [];

    function range(arr) {

        var length = arr.length;

        for (var i = 0; i < length; i++) {

            var target = arr.splice(i, 1)[0];
            tmpArr.push(target);

            if (!arr.length) {
                var item = tmpArr.join('');
                if (res.indexOf(item) === -1) {
                    res.push(item);
                }
            }

            var copyArr = arr.slice(0);

            range(copyArr);
            arr.unshift(target);
            tmpArr.pop();

        }
    }

    range(stringArr);

    return res;

}

/**
 * 扩展Date类，实现getChineseTime函数，满足以下功能。
 * var now = new Date();
 * alert(now.getChineseTime()); //输出 “十一点五十一分”
 * 提示：可能会用到Date类的方法getHours()     getMinutes()
 * 注意中文时间的文字输出符合口语习惯
 */

var wordMap = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

function getTimeWord(timeNum, needComplete) {

    if (timeNum < 10) {
        return (needComplete && timeNum ? wordMap[0] : '') + wordMap[timeNum];
    }

    var remain = timeNum % 10;
    var divide = parseInt(timeNum / 10, 10);

    return (divide > 1 ? wordMap[divide] : '') + wordMap[10] + (remain ? wordMap[remain] : '');
}

Date.prototype.getChineseTime = function () {

    var minute = this.getMinutes();

    var minuteWord = minute ? getTimeWord(this.getMinutes(), true) + '分' : '整';

    return getTimeWord(this.getHours()) + '点' + minuteWord;

};


/**
 * generator 题目一
 *
 * @param  {Function} sequencer 序列函数
 * @return {Object}             包含next方法的对象
 */
function generator(sequencer) {

    if (!sequencer) {
        // 某种错误处理
        return;
    }

    var args = Array.prototype.slice.call(arguments, 1);
    var sequencerRes = sequencer.apply(sequencer, args);

    return {
        next: function () {
            return sequencerRes();
        }
    };
}

/**
 * generator 题目二
 *
 * @param  {number} start 起始值
 * @param  {number} step 递增值
 * @return {Function}
 */
function rangeSeq(start, step) {

    start = start || 0;
    step = step || 0;
    var res;

    return function () {

        if (!res) {
            res = start;
            return res;
        }

        res = res + step;
        return res;
    };
}

/**
 * LazyMan
 *
 * @param {string} name lazy man name
 * @return {Object} 支持链式调用的对象
 */
function LazyMan(name) {

    var lock;
    var firstSleepLock;
    var queue = [];

    function sayHi() {
        console.log('Hi! This is ' + name + '!');
    }

    // 执行函数队列
    function execQueue() {
        for (var i = 0; i < queue.length; i++) {

            var funcItem = queue[i];
            funcItem.func.apply(obj, funcItem.arguments);

            // 如果再次进入sleep则停止遍历执行队列并清空已执行的方法
            if (lock) {
                queue = queue.slice(i + 1);
                return;
            }

        }
    }

    function commonSleep(sec, isFirstSleep) {

        if (isFirstSleep) {
            firstSleepLock = true;
        }
        else {
            lock = true;
        }

        sec = sec || 0;

        setTimeout(function () {

            if (isFirstSleep) {
                firstSleepLock = false;
            }
            else {
                lock = false;
            }

            console.log('Wake up after ' + sec);
            execQueue();

        }, sec * 1000);
    }

    var obj = {

        sleepFirst: function (sec) {

            commonSleep(sec, true);

            return this;
        },

        sleep: function (sec) {

            setTimeout(function () {

                if (lock || firstSleepLock) {
                    queue.push({
                        func: arguments.callee,
                        arguments: arguments
                    });
                    return;
                }

                commonSleep(sec);

            }, 0);

            return this;
        },

        eat: function (eatName) {

            setTimeout(function () {

                if (lock || firstSleepLock) {
                    queue.push({
                        func: arguments.callee,
                        arguments: arguments
                    });
                    return;
                }

                console.log('Eat ' + eatName);

            }, 0);

            return this;
        }
    };

    setTimeout(function () {

        if (!firstSleepLock) {
            sayHi();
            return;
        }

        queue.push({
            func: sayHi
        });

    }, 0);

    return obj;
}
