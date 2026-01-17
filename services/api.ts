
import { GAS_URL } from '../constants';
import { GASResponse, Video, Student } from '../types';

class ApiService {
  /**
   * 极致精简的 POST 请求：
   * 1. 不设置任何 headers。
   * 2. 传递 string 类型的 body。
   * 3. 浏览器会将其视为 Simple Request (text/plain)，从而避开 GAS 不支持的 OPTIONS 预检。
   */
  private async post<T>(action: string, payload: any = {}): Promise<GASResponse<T>> {
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        // 注意：这里绝对不能写 headers，让浏览器自动处理
        body: JSON.stringify({ action, ...payload }),
        redirect: 'follow',
      });

      if (!response.ok) {
        throw new Error(`HTTP 状态码: ${response.status}`);
      }

      const text = await response.text();
      try {
        const result = JSON.parse(text);
        return result as GASResponse<T>;
      } catch (e) {
        console.error('解析服务器返回内容失败:', text);
        throw new Error('服务器未返回有效的 JSON 格式，请检查 GAS 脚本逻辑。');
      }
    } catch (error: any) {
      console.error('API 请求异常:', error);
      return { 
        success: false, 
        message: error.message === 'Failed to fetch' 
          ? '网络连接被阻断。请检查：1. Adblock 是否拦截了脚本；2. 您的网络是否允许访问 google.com 域名。' 
          : (error.message || '未知连接错误')
      };
    }
  }

  async getVideos(): Promise<Video[]> {
    const res = await this.post<Video[]>('getVideos');
    if (res.success && res.data) {
      return res.data;
    }
    // 如果失败，抛出错误以便 App.tsx 捕获并显示错误面板
    throw new Error(res.message || '获取视频列表失败');
  }

  async login(studentID: string, password: string): Promise<GASResponse<Student>> {
    return await this.post<Student>('login', { studentID, password });
  }

  async unlockVideo(studentID: string, videoID: string): Promise<GASResponse<{ videoUrl: string, materialLink?: string }>> {
    return await this.post<{ videoUrl: string, materialLink?: string }>('unlock', { studentID, videoID });
  }

  async markWatched(studentID: string, videoID: string): Promise<GASResponse<boolean>> {
    return await this.post<boolean>('markWatched', { studentID, videoID });
  }
}

export const api = new ApiService();
