import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private defaultAvatar = 'assets/images/Capture.png';

  getSafeAvatar(user: any): string {
    if (!user) return this.defaultAvatar;
    
    // Check both user.avatar and root-level userAvatar
    const avatar = user.avatar || user.userAvatar;
    
    if (typeof avatar === 'string' && 
        (avatar.startsWith('data:') || avatar.startsWith('http'))) {
      return avatar;
    }
    
    return this.defaultAvatar;
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.src !== this.defaultAvatar) {
      img.src = this.defaultAvatar;
    }
  }
}