import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "projects/mediabox-web/src/environments/environment";
import { Subject } from "rxjs";


const BACKEND_URL = environment.backendUrl + 'files';
@Injectable({ providedIn: 'root' })
export class AudioService {
    private GET_PRESIGNED_URL_ENDPOINT = environment.backendUrl+'getPresignedUrl/';

    private fileUploaded = new Subject<any>();
    private audioFilesFetched = new Subject<Record<string, string>[]>();

    constructor(private http:HttpClient) {}

    private getPresignedUrl() {
        return this.GET_PRESIGNED_URL_ENDPOINT;
    }

    getFileUploadedListener() {
        return this.fileUploaded.asObservable();
    }

    getAudioFilesFetchedListener() {
        return this.audioFilesFetched.asObservable();
    }

    getAudioFiles() {
        this.http.get< Record<string, string>[]>(BACKEND_URL).subscribe(response => {
            this.audioFilesFetched.next(response)
        });
    }

    postAudioFile(file: File) {
        const headers = new HttpHeaders({ 'Content-Type': file.type });
        this.http.get<any>(this.getPresignedUrl()).subscribe((response) => {
          const signedUrl = response.signedUrl;
          this.http
            .put<any>(signedUrl, file, { headers, reportProgress: true })
            .subscribe((s3UploadResponse) => {
              this.http.post<any>(BACKEND_URL, {
                fileId: signedUrl.split('?')[0].split("/").at(-1),
                url: signedUrl.split('?')[0]
              }).subscribe(response3 => {
                this.fileUploaded.next(response3)
              })
            });
        });
    }
}