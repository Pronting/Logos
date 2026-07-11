---
title: 替换子串得到平衡字符串
pubDate: 2026-07-11
draft: false
description: 双指针的变式运用
tags:
  - Algorithm Problem
---

# 原题
[LeetCode 1234: 替换子串得到平衡字符串](https://leetcode.cn/problems/replace-the-substring-for-balanced-string/description/)


# 思路分析
题目是这样说的：_替换一段连续子串，使整个字符串变成平衡_ 。就是说: ==这段连续子串可以删掉，然后填充新的字符，让整体平衡==

```text
原字符串

窗口里面：
XXXX

 ↓

替换以后

YYYY
```

如图，可以发现一个规律，就是窗口里面的字符串是什么，是否平衡并不重要。反正最后都会变成新的。也就是说，连续子串的这一段窗口都是待修改区域。


那么下意识就想到窗口内和窗口外的区别，这也是 ==滑动窗口== 的一个规律，窗口内能随意修改吗？窗口外是否都不能改呢？

基本按照我们思维惯性可以往下面思考：
> 如果窗口外已经合法，那么窗口里面一定可以改成合法


所以来看看下面的这个例子

![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260711085112296.png)

根据题意，我们可以得到这4个字符的出现频次只能是2次， A 字符多了一次，按照滑动窗口划分左右边界。我随意划分了2种，都是合法的
1. 第一种可以将 A 替换为 W
2. 第二种可以将 AA 替换为 AW


举一个反例
![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260711085446904.png)
这个例子发现了即使如何替换窗口内的字符，A 字符始终出现了 3 次，多了一次。

所以可以总结一个规律：
* 窗口外的字符频次 <= 目标频次(长度 / 4)

我们不妨将这个判断定义为 `check()` 
可以定义伪代码
```java
if(check()) l++;
```


# AC 代码
```java
class Solution {
    public int balancedString(String s) {
        int[] cnt = new int[4];
        char[] chs = s.toCharArray();
        for(char cur : chs){
            cnt[index(cur)]++;
        }
        int validCount = 0;
        int target = chs.length / 4;
        for(int cur : cnt) if(cur == target) validCount++;
        if(validCount == 4) return 0;
        int l = 0;
        int minlen = Integer.MAX_VALUE;
        for(int r = 0; r < chs.length; r++){
            cnt[index(chs[r])]--;
            while(check(cnt, target)){
                minlen = Math.min(minlen, r - l + 1);
                cnt[index(chs[l])]++;
                l++;
            }
        }
        return minlen;
    }
    public boolean check(int[] cnt, int target){
        for(int cur : cnt){
            if(cur > target) return false;
        }
        return true;
    }

    public int index(char c){
        if(c == 'Q') return 0;
        if(c == 'W') return 1;
        if(c == 'E') return 2;
        if(c == 'R') return 3;
        return -1;
    }
}
```