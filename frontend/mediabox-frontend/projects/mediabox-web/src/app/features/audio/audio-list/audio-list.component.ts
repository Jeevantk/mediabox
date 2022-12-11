import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AudioService } from '../audio.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateTime } from 'luxon';

export interface UserAudio {
  userId: string;
  createdAt: string;
  fileId?: string;
  processingStatus: string;
  textData?: string;
  transcriptionId?: string;
  url: string;
  words?: Record<string,any>[];
}

@Component({
  selector: 'app-audio-list',
  templateUrl: './audio-list.component.html',
  styleUrls: ['./audio-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AudioListComponent implements OnInit, OnDestroy {

  dataSource: Record<string, string>[] = []
  isLoading = false;
  displayedColumns:string[] = ["isSynced", "player", "fileId", "createdAt" ];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  searchValue = '';
  form!: FormGroup;
  expandedElement: UserAudio | null = null;

  fileUploadedSub!: Subscription;
  audioFilesFetchedSub!: Subscription;

  constructor(private router:Router, private audioService: AudioService, private _snackBar: MatSnackBar) { }

  ngOnDestroy(): void {
    this.fileUploadedSub?.unsubscribe();
    this.audioFilesFetchedSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      file: new FormControl(null, { validators: [Validators.required] })
    });

    this.audioFilesFetchedSub = this.audioService.getAudioFilesFetchedListener().subscribe(response => {
      this.isLoading = false;
      this.dataSource = response;
    })

    this.fileUploadedSub = this.audioService.getFileUploadedListener().subscribe(response => {
      this._snackBar.open("File uploaded successfully", '', {
        duration: 3000
      });
      this.fetchUserAudioFiles();
    });

    this.fetchUserAudioFiles();
  }

  onAudioPicked(event: Event) {
    const file = (event?.target as HTMLInputElement).files![0];
    this.form.patchValue({ image: file });
    this._snackBar.open("Uploading file...", '', {
      duration: 3000
    })
    this.audioService.postAudioFile(file);
  }

  getFormattedDateTime(dateString: string) {
    return DateTime.fromISO(dateString).toFormat('dd-mm-yyyy hh:mm')
  }

  async getSearchResults() {
    if(this.searchValue === '') {
      this.fetchUserAudioFiles();
    }
    else {
      this.dataSource = await this.audioService.searchAudioFiles(this.searchValue);
    }
  }

  onClearSearch() {
    this.searchValue = '';
    this.fetchUserAudioFiles();
  }  

  fetchUserAudioFiles() {
    this.isLoading = true;
    this.audioService.getAudioFiles();
  }

}
