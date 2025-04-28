import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private defaultAvatar = 'assets/images/Capture.png';

  getSafeAvatar(user: any): string {
    if (!user) return this.defaultAvatar;
    
    // If avatar is already a data URL, return it directly
    if (typeof user.avatar === 'string' && 
        (user.avatar.startsWith('data:') || user.avatar.startsWith('http'))) {
      return user.avatar;
    }
    
    // Fallback to default
    return this.defaultAvatar;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.src !== this.defaultAvatar) {
      img.src = this.defaultAvatar;
    }
  }
}