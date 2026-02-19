import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // Create Admin User
    const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@algoforge.com' } });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.user.create({
            data: {
                email: 'admin@algoforge.com',
                username: 'admin',
                password: hashedPassword,
            },
        });
        console.log('Created admin user: admin@algoforge.com');
    }

    // Define Problems
    const problems = [
        {
            title: "Two Sum",
            slug: "two-sum",
            difficulty: "Easy",
            description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
            starterCode: "function twoSum(nums, target) {\n  // Write your code here\n};",
            testCases: JSON.stringify([
                { input: "[2,7,11,15], 9", output: "[0,1]" },
                { input: "[3,2,4], 6", output: "[1,2]" },
                { input: "[3,3], 6", output: "[0,1]" }
            ]),
            acceptance: 48.2
        },
        {
            title: "Add Two Numbers",
            slug: "add-two-numbers",
            difficulty: "Medium",
            description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
            starterCode: "/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\n/**\n * @param {ListNode} l1\n * @param {ListNode} l2\n * @return {ListNode}\n */\nvar addTwoNumbers = function(l1, l2) {\n    \n};",
            testCases: JSON.stringify([
                { input: "[2,4,3], [5,6,4]", output: "[7,0,8]" },
                { input: "[0], [0]", output: "[0]" },
                { input: "[9,9,9,9,9,9,9], [9,9,9,9]", output: "[8,9,9,9,0,0,0,1]" }
            ]),
            acceptance: 39.1
        },
        {
            title: "Longest Substring Without Repeating Characters",
            slug: "longest-substring-without-repeating-characters",
            difficulty: "Medium",
            description: "Given a string s, find the length of the longest substring without repeating characters.",
            starterCode: "/**\n * @param {string} s\n * @return {number}\n */\nvar lengthOfLongestSubstring = function(s) {\n    \n};",
            testCases: JSON.stringify([
                { input: "\"abcabcbb\"", output: "3" },
                { input: "\"bbbbb\"", output: "1" },
                { input: "\"pwwkew\"", output: "3" }
            ]),
            acceptance: 32.8
        },
        {
            title: "Median of Two Sorted Arrays",
            slug: "median-of-two-sorted-arrays",
            difficulty: "Hard",
            description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
            starterCode: "/**\n * @param {number[]} nums1\n * @param {number[]} nums2\n * @return {number}\n */\nvar findMedianSortedArrays = function(nums1, nums2) {\n    \n};",
            testCases: JSON.stringify([
                { input: "[1,3], [2]", output: "2.00000" },
                { input: "[1,2], [3,4]", output: "2.50000" }
            ]),
            acceptance: 35.6
        },
        {
            title: "Longest Palindromic Substring",
            slug: "longest-palindromic-substring",
            difficulty: "Medium",
            description: "Given a string s, return the longest palindromic substring in s.",
            starterCode: "/**\n * @param {string} s\n * @return {string}\n */\nvar longestPalindrome = function(s) {\n    \n};",
            testCases: JSON.stringify([
                { input: "\"babad\"", output: "\"bab\"" },
                { input: "\"cbbd\"", output: "\"bb\"" }
            ]),
            acceptance: 31.7
        },
        {
            title: "Reverse Integer",
            slug: "reverse-integer",
            difficulty: "Medium",
            description: "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.",
            starterCode: "/**\n * @param {number} x\n * @return {number}\n */\nvar reverse = function(x) {\n    \n};",
            testCases: JSON.stringify([
                { input: "123", output: "321" },
                { input: "-123", output: "-321" },
                { input: "120", output: "21" }
            ]),
            acceptance: 27.3
        },
        {
            title: "Palindrome Number",
            slug: "palindrome-number",
            difficulty: "Easy",
            description: "Given an integer x, return true if x is a palindrome, and false otherwise.",
            starterCode: "/**\n * @param {number} x\n * @return {boolean}\n */\nvar isPalindrome = function(x) {\n    \n};",
            testCases: JSON.stringify([
                { input: "121", output: "true" },
                { input: "-121", output: "false" },
                { input: "10", output: "false" }
            ]),
            acceptance: 52.5
        }
    ]

    for (const problem of problems) {
        const existingProblem = await prisma.problem.findUnique({ where: { slug: problem.slug } });
        if (!existingProblem) {
            await prisma.problem.create({ data: problem });
            console.log(`Created problem: ${problem.title}`);
        } else {
            console.log(`Problem already exists: ${problem.title}`);
        }
    }

    console.log('Seeding completed.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
