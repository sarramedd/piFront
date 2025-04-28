import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  private defaultAvatar = 'assets/images/Capture.png';
  private avatarCache = new Map<string, string>();
  constructor() {}

  /**
   * Get the safe avatar URL for a user
   * @param user User object containing avatar information
   * @returns Safe avatar URL (either base64 data URL or default image)
   */
  getSafeAvatar(user: any): string {
    if (!user) return this.defaultAvatar;
    
    const cacheKey = user.id + (user.avatar || user.userAvatarUrl || '');
    if (this.avatarCache.has(cacheKey)) {
      return this.avatarCache.get(cacheKey)!;
    }
  
    let avatarUrl = this.defaultAvatar;
    
    if (user.avatar) {
      avatarUrl = this.formatBase64Avatar(user.avatar);
    } else if (user.userAvatarUrl) {
      avatarUrl = user.userAvatarUrl;
    }
  
    this.avatarCache.set(cacheKey, avatarUrl);
    return avatarUrl;
  }

  /**
   * Format base64 string into proper data URL
   * @param base64String The base64 image string
   * @returns Properly formatted data URL
   */
  private formatBase64Avatar(base64String: string): string {
    if (base64String.startsWith('data:')) return base64String;
    
    // Simple check for PNG (base64 starts with 'iVBORw')
    const isPng = base64String.startsWith('iVBORw');
    return `data:image/${isPng ? 'png' : 'jpeg'};base64,${base64String}`;
  }
  /**
   * Handle image loading errors
   * @param event The error event
   */
  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.src !== this.defaultAvatar) {
      img.src = this.defaultAvatar;
    }
  }
}