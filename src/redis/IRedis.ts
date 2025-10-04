// redis.service.interface.ts

export interface IRedisService {
    /**
     * ذخیره پیام برای کاربری که آفلاین است
     * @param receiverId شناسه کاربر گیرنده
     * @param message محتوای پیام به صورت رشته JSON
     */
    saveOfflineMessage(receiverId: string, message: string): Promise<void>;
  
    /**
     * دریافت تمام پیام‌های آفلاین یک کاربر
     * @param receiverId شناسه کاربر
     * @returns آرایه‌ای از پیام‌های پارس شده
     */
    getOfflineMessages(receiverId: string): Promise<string[]>;
  
    /**
     * حذف تمام پیام‌های آفلاین یک کاربر پس از دریافت
     * @param receiverId شناسه کاربر
     */
    deleteOfflineMessages(receiverId: string): Promise<void>;
  
    /**
     * بررسی آنلاین بودن کاربر و دریافت شناسه سوکت
     * @param userId شناسه کاربر
     * @returns شناسه سوکت کاربر یا null اگر آفلاین باشد
     */
    getOnlineUser(userId: string): Promise<string | null>;
  
    /**
     * ثبت وضعیت آنلاین برای کاربر
     * @param userId شناسه کاربر
     * @param socketId شناسه سوکت اتصال
     * @returns نتیجه عملیات
     */
    setUserOnline(userId: string, socketId: string): Promise<string | null>;
  }