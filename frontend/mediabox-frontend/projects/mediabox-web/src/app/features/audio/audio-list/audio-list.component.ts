import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AudioService } from '../audio.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateTime } from 'luxon';
import * as _ from 'lodash';

export interface UserAudio {
  userId: string;
  createdAt: string;
  fileId: string;
  fileName: string;
  processingStatus: string;
  textData?: string;
  transcriptionId?: string;
  url: string;
  words?: Record<string, any>[];
}

@Component({
  selector: 'app-audio-list',
  templateUrl: './audio-list.component.html',
  styleUrls: ['./audio-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class AudioListComponent implements OnInit, OnDestroy {
  dataSource: Record<string, string>[] = [];
  isLoading = false;
  displayedColumns: string[] = ['isSynced', 'player', 'fileId', 'createdAt'];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  searchValue = '';
  form!: FormGroup;
  expandedElement: UserAudio | null = null;

  fileUploadedSub!: Subscription;
  audioFilesFetchedSub!: Subscription;

  constructor(
    private router: Router,
    private audioService: AudioService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnDestroy(): void {
    this.fileUploadedSub?.unsubscribe();
    this.audioFilesFetchedSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      file: new FormControl(null, { validators: [Validators.required] }),
    });

    this.audioFilesFetchedSub = this.audioService
      .getAudioFilesFetchedListener()
      .subscribe((response) => {
        this.isLoading = false;
        this.dataSource = response;
      });

    this.fileUploadedSub = this.audioService
      .getFileUploadedListener()
      .subscribe((response) => {
        this._snackBar.open('File uploaded successfully', '', {
          verticalPosition: 'top',
          duration: 3000,
        });
        this.fetchUserAudioFiles();
      });

    this.fetchUserAudioFiles();
  }

  computeAudioDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
      var objectURL = URL.createObjectURL(file);
      var mySound = new Audio(objectURL);
      mySound.addEventListener(
        'canplaythrough',
        () => {
          URL.revokeObjectURL(objectURL);
          resolve(mySound.duration);
        },
        false
      );
    });
  }

  async onAudioPicked(event: Event) {
    const file = (event?.target as HTMLInputElement).files![0];
    this.form.patchValue({ image: file });
    console.log(file);

    const errorMessage = await this.getErrorMessages(file);

    if (errorMessage.length === 0) {
      this._snackBar.open('Uploading file...', '', {
        verticalPosition: 'top',
        duration: 3000,
      });
      this.audioService.postAudioFile(file);
    } else {
      this._snackBar.open(errorMessage, '', {
        verticalPosition: 'top',
        duration: 5000,
      });
    }
  }

  async getErrorMessages(file: File) {
    if (!file.type.startsWith('audio/') || !file.type.startsWith('video/')) {
      return 'Invalid file type, please enter a valid audio file';
    }
    const duration = await this.computeAudioDuration(file);

    if (duration > 3600) {
      return 'Please upload audio files with duration less than 1 hour.';
    }

    return '';
  }

  getFormattedDateTime(dateString: string) {
    return DateTime.fromISO(dateString).toFormat('dd-mm-yyyy hh:mm');
  }

  async getSearchResults() {
    if (this.searchValue === '') {
      this.fetchUserAudioFiles();
    } else {
      this.dataSource = await this.audioService.searchAudioFiles(
        this.searchValue
      );
    }
  }

  onSearch = _.debounce(this.getSearchResults, 500);

  onClearSearch() {
    this.searchValue = '';
    this.fetchUserAudioFiles();
  }

  fetchUserAudioFiles() {
    this.isLoading = true;
    this.audioService.getAudioFiles();
  }
}
