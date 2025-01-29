'use server';

import prisma from "../../lib/prisma";

export async function checkAndAddUser(email: string, name: string) {
    if(!email) return;

    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        if(!existingUser && name){
            await prisma.user.create({
                data: {
                    email,
                    name
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
}