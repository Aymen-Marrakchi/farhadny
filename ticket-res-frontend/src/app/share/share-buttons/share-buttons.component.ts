import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-share-buttons',
  templateUrl: './share-buttons.component.html',
  styleUrls: ['./share-buttons.component.scss']
})
export class ShareButtonsComponent {
  @Input() url: string = window.location.href;
  @Input() title: string = 'Check this out!';

  shareLinks = {
    facebook: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: (url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    twitter: (url: string, title: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    whatsapp: (url: string, title: string) => `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`,
    email: (url: string, title: string) => `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
  };

  openShareWindow(platform: keyof typeof this.shareLinks) {
    const shareUrl = this.shareLinks[platform](this.url, this.title);
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }
}