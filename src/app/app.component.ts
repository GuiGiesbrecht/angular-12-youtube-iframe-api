import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  /* 1. Some required variables which will be used by YT API*/
  YT: any;
  video: any;
  player: any;

  youtubeCreate() {
    if (this.player) {
      this.youtubeDestroy();
      this.startVideo();
    } else {
      this.startVideo();
    }
  }

  youtubeDestroy() {
    if (this.player) {
      this.player.destroy();
      this.player = null;
    } else {
      alert('Player not found');
    }
  }

  checkYoutubeUrl(ytbUrl) {
    if (ytbUrl.includes('watch?v=')) {
      this.video = ytbUrl.split('https://www.youtube.com/watch?v=')[1];
      this.youtubeCreate();
    } else if (ytbUrl.includes('youtu.be/')) {
      this.video = ytbUrl.split('https://youtu.be/')[1];
      this.youtubeCreate();
    } else {
      alert(
        'Please use a validy Youtube Link\nExemples:\nhttps://www.youtube.com/watch?v=videoId\nhttps://youtu.be/videoId'
      );
    }
  }

  /* 2. It will be called to create the Video Player */
  startVideo() {
    this.player = new window['YT'].Player('player', {
      videoId: this.video,
      playerVars: {
        height: '100%',
        width: '100%',
        modestbranding: 1,
        controls: 1,
        disablekb: 1,
        rel: 0,
        showinfo: 0,
        fs: 1,
        playsinline: 1,
      },
      events: {
        onStateChange: this.onPlayerStateChange.bind(this),
        onError: this.onPlayerError.bind(this),
        onReady: this.onPlayerReady.bind(this),
      },
    });
  }

  /* 4. It will be called when the Video Player is ready (AutoPlay)*/
  onPlayerReady(event) {
    event.target.playVideo();
  }

  /* 5. API will call this function when Player State changes like PLAYING, PAUSED, ENDED */
  onPlayerStateChange(event) {
    console.log(event);
    switch (event.data) {
      case window['YT'].PlayerState.PLAYING:
        if (this.cleanTime() == 0) {
          console.log('started ' + this.cleanTime());
        } else {
          console.log('playing ' + this.cleanTime());
        }
        break;
      case window['YT'].PlayerState.PAUSED:
        if (this.player.getDuration() - this.player.getCurrentTime() != 0) {
          console.log('paused' + ' @ ' + this.cleanTime());
        }
        break;
      case window['YT'].PlayerState.ENDED:
        console.log('Ended');
        break;
    }
  }

  cleanTime() {
    return Math.round(this.player.getCurrentTime());
  }

  /* 6. It will be called when the Video Player failed */
  onPlayerError(event) {
    switch (event.data) {
      case 2:
        alert('Video Id: ' + this.video + ' is not validy.');
        this.youtubeDestroy();
        break;
      case 100:
        break;
      case 101 || 150:
        break;
    }
  }
}
