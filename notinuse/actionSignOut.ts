// XXX 이거 사용안함. components\SignOut\SignOut.tsx 에서 직접 처리함. 
// 왜? --> 정상 로그아웃이 안됨. 
// ==> 로그아웃해도 UserButton 이 변경이 안됨. 에러 
// signOut 을 해도 UserButton 에서 useSessin 이용해서 session 을 가져오면
// 이전 old session 값을 보여줌..  ==> null 이 정상임 

// ----------------------------------------------------
// 'use server'
// import { signOut } from "@/auth"; //XXX not works

// ----------------------------------------------------
// "use client";
// import { signOut } from "next-auth/react"; // this works !!!

// export async function actionSignOut() {
//     await signOut();
// }