import type { User, Beat } from "@prisma/client";

import { prisma } from "~/db.server";

export function getBeat({
    id,
    userId,
}: Pick<Beat, "id"> & {
    userId: User["id"];
}) {
    console.log('Getting Beat', id);
    return prisma.beat.findUnique({
        where: { id: id },
    });
}

// export function getBeatListItems({ userId }: { userId: User["id"] }) {
//     return prisma.beat.findMany({
//         where: { userId },
//         select: { id: true, title: true },
//         orderBy: { updatedAt: "desc" },
//     });
// }
type IDObject = {id: number} 
interface BeatInput {
    bpm: string;
    title: string;
    file: string; // Assuming file is a string URL
    tags: IDObject[]; // [{id: 5}, {id: 3}] // //etc
}
export function createBeat({bpm, title, file, tags}: BeatInput) {
    return prisma.beat.create({
        data: {
            title,
            bpm,
            file,
            tags: {
                connect: tags
            }
        },
    });
}

// export function deleteBeat({
//     id,
//     userId,
// }: Pick<Beat, "id"> & { userId: User["id"] }) {
//     return prisma.beat.deleteMany({
//         where: { id, userId },
//     });
// }
