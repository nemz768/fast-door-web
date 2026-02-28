// import { makeAutoObservable } from 'mobx';


// class RegStore {
//   user: any = null;
//   isLoading = false;
//   error: string | null = null;
//   validationErrors: { username?: string; password?: string; confirmPassword?: string; storeName?: string; role?: string } = {};

//     constructor() {
//     makeAutoObservable(this);
//     }

//     async register(credentials: { username: string; password: string; confirmPassword: string; storeName: string; role: string }) {
//         this.isLoading = true;
//         this.error = null;

//         try {
//             const baseUrl = process.env.NEXT_PUBLIC_API_URL; 
//             const response = await fetch(`${baseUrl}/register`, {}
//         }

//         catch (error: any) {
//             if (!this.error) {
//             this.error = 'Ошибка подключения. Проверьте интернет';
//       }
//          throw error; 
//         }
//     }


// }