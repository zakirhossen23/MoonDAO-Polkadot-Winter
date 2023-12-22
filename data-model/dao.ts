export interface Dao {
    daoId: string;
    Title: string;
    Start_Date: Date;
    logo: string;
    wallet: string;
    SubsPrice: string;
    user_info:{
        id:number;
        fullName: string;
        email:string;
        imgIpfs:string;
        walletType:string;
        walletAddress:string;
    }
}
