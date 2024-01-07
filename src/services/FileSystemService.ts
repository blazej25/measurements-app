import RNFS from 'react-native-fs';
class FileSystemService {
  saveJSON(json: Object, fileName: string) {
    // create a path you want to write to
    // :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
    // but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
    var path = RNFS.DownloadDirectoryPath + '/' + fileName;

    // write the file
    RNFS.writeFile(path, JSON.stringify(json, null, 2), 'utf8')
      .then(success => {
        console.log('File written to: ' + path);
      })
      .catch(err => {
        console.log(err.message);
      });
  }
}

export default FileSystemService;
