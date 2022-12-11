import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "projects/mediabox-web/src/environments/environment";
import { Subject } from "rxjs";
import algoliasearch from "algoliasearch";
import { AuthService } from "../auth/auth.service";


const BACKEND_URL = environment.backendUrl + 'files';
@Injectable({ providedIn: 'root' })
export class AudioService {
    private GET_PRESIGNED_URL_ENDPOINT = environment.backendUrl+'getPresignedUrl/';

    private fileUploaded = new Subject<any>();
    private audioFilesFetched = new Subject<Record<string, string>[]>();
    private algoliaClient = algoliasearch(
      environment.algoliaAppId,
      environment.algoliaApiKey
    );
    private mediaBoxIndex = this.algoliaClient.initIndex("mediabox");

    constructor(private http:HttpClient, private authService: AuthService) {}

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
        this.http.get<any>(this.getPresignedUrl(), { headers }).subscribe((response) => {
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

    async searchAudioFiles(keyword: string): Promise<Record<string,any>[]> {
      const userId = this.authService.getUserId();
      const results = await this.mediaBoxIndex.search(keyword, {
        filters: userId
      })
      return results?.hits;
    }
}