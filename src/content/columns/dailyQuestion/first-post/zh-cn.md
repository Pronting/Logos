---
title: 分批萨 (区间DP + 对抗博弈)
pubDate: 2026-06-28
draft: false
description: 卡了半下午,记录一下
tags:
  - Algorithm Problem
---

# 原题

## 题目描述
"吃货"和"馋嘴"两人到披萨店点了一份铁盘（圆形）披萨，并嘱咐店员将披萨按放射状切成大小相同的偶数个小块。但是粗心的服务员将披萨切成了每块大小都完全不同奇数块，且肉眼能分辨出大小。

由于两人都想吃到最多的披萨，他们商量了一个他们认为公平的分法：从"吃货"开始，轮流取披萨。除了第一块披萨可以任意选取外，其他都必须从缺口开始选。

他俩选披萨的思路不同。"馋嘴"每次都会选最大块的披萨，而且"吃货"知道"馋嘴"的想法。

已知披萨小块的数量以及每块的大小，求"吃货"能分得的最大的披萨大小的总和。

## 输入描述
第 1 行为一个正整数奇数 N(3 ≤ N < 500)，表示披萨小块数量。

接下来的第 2 行到第 N + 1 行（共 N 行），每行为一个正整数，表示第 i(1 ≤ i ≤ N) 块披萨的大小
披萨小块从某一块开始，按照一个方向次序顺序编号为 1 ~ N 
每块披萨的大小范围为 [1, 2147483647]


## 输出描述
"吃货"能分得到的最大的披萨大小的总和。

## 用例输入
```text
5
8
2
10
5
7
```

## 用例输出
```
19
```

说明

> 此例子中，有 5 块披萨。每块大小依次为 8、2、10、5、7。
按照如下顺序拿披萨，可以使"吃货"拿到最多披萨：
“吃货” 拿大小为 10 的披萨
“馋嘴” 拿大小为 5 的披萨
“吃货” 拿大小为 7 的披萨
“馋嘴” 拿大小为 8 的披萨
“吃货” 拿大小为 2 的披萨
至此，披萨瓜分完毕，"吃货"拿到的披萨总大小为 10 + 7 + 2 = 19
可能存在多种拿法，以上只是其中一种。




# 思路一览

数组通过特殊处理可以连成环，我们可以想象成绳子，缺口不断放大就是绳子两端不断缩小的过程，即 `[L,R]` 不断缩减
![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260628152919629.png)

第一块拿完后，圆环变成线性区间， 而馋嘴的策略固定，即 `max(l, r)`

![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260628153652612.png)


那么状态推移过程我画了个草图

![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260628154558605.png)


一个很明显的区间 dp 模型，可以写出推导方程式

$$
dp[l][r] = \max\big(
pizza[l] + dp[nextL_1][nextR_1],
pizza[r] + dp[nextL_2][nextR_2]
\big)
$$

通俗的讲分为两种情况：
1. 吃货选左边，剩下的区间是馋嘴在吃货选择完后再次选剩下的区间
2. 吃货选右边，剩下的区间是馋嘴在吃货选择完后再次选剩下的区间




# AC 代码
```java
import java.util.*;

public class Main {

    static int n;
    static long[] pizza;

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        n = sc.nextInt();
        pizza = new long[n];
        for (int i = 0; i < n; i++) {
            pizza[i] = sc.nextLong();
        }
        long ans = 0;
        // 枚举第一块
        for (int first = 0; first < n; first++) {
            long[] arr = new long[n - 1];
            int idx = 0;
            for (int k = 1; k < n; k++) {
                arr[idx++] = pizza[(first + k) % n];
            }
            int m = n - 1;
            long[][] dp = new long[m][m];
            // 初始化dp
            for (int i = 0; i < m; i++) {
                dp[i][i] = arr[i];
            }
            // 区间DP
            for (int len = 2; len <= m; len++) {
                for (int l = 0; l + len - 1 < m; l++) {
                    int r = l + len - 1;
                    // ---------- 吃左 ----------
                    long left;
                    if (l == r) {
                        left = arr[l];
                    } else {
                        int nl = l + 1;
                        int nr = r;
                        if (nl <= nr) {
                            if (arr[nl] > arr[nr]) {
                                nl++;
                            } else {
                                nr--;
                            }
                        }
                        left = arr[l];
                        if (nl <= nr) {
                            left += dp[nl][nr];
                        }
                    }
                    // ---------- 吃右 ----------
                    long right;
                    if (l == r) {
                        right = arr[r];
                    } else {
                        int nl = l;
                        int nr = r - 1;
                        if (nl <= nr) {
                            if (arr[nl] > arr[nr]) {
                                nl++;
                            } else {
                                nr--;
                            }
                        }
                        right = arr[r];
                        if (nl <= nr) {
                            right += dp[nl][nr];
                        }
                    }
                    dp[l][r] = Math.max(left, right);
                }
            }
            ans = Math.max(ans, pizza[first] + dp[0][m - 1]);
        }
        System.out.println(ans);
    }
}
```

