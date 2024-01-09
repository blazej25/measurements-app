import {Alert} from 'react-native';
import RNFS from 'react-native-fs';

class FileSystemService {
  saveToExternalStorage(contents: string, fileName: string) {
    var path = RNFS.DownloadDirectoryPath + '/' + fileName;
    this._writeToPath(contents, path);
  }
  saveToInternalStorage(contents: string, fileName: string) {
    var path = RNFS.DocumentDirectoryPath + '/' + fileName;
    this._writeToPath(contents, path);
  }
  saveObjectToExternalStorage(json: Object, fileName: string) {
    var path = RNFS.DownloadDirectoryPath + '/' + fileName;
    this._writeToPath(JSON.stringify(json, null, 2), path);
  }
  saveObjectToInternalStorage(json: Object, fileName: string) {
    // DocumentDirectoryPath is located in the internal storage, we
    // use the internal storage for persiting the transient state
    // when the app is closed.
    var path = RNFS.DocumentDirectoryPath + '/' + fileName;
    this._writeToPath(JSON.stringify(json, null, 2), path);
  }

  _writeToPath(contents: string, path: string) {
    RNFS.writeFile(path, contents, 'utf8')
      .then(_success => {
        console.log('File written to: ' + path);
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  saveToExternalStorageAlert(
    contents: string,
    fileName: string,
    alertSuccess: string,
    alertError: string,
  ) {
    var path = RNFS.DownloadDirectoryPath + '/' + fileName;
    RNFS.writeFile(path, contents, 'utf8')
      .then(_success => {
        console.log('File written to: ' + path);
        Alert.alert(alertSuccess);
      })
      .catch(err => {
        console.log(err.message);
        Alert.alert(alertError);
      });
  }
  async loadJSONFromInternalStorage(fileName: string): Promise<Object> {
    var path = RNFS.DocumentDirectoryPath + '/' + fileName;

    return RNFS.readFile(path, 'ascii')
      .then(success => {
        const fileContents = success;
        return JSON.parse(fileContents);
      })
      .catch(err => {
        console.log(err.message);
        return {};
      });
  }

  async loadJSONFromPath(path: string): Promise<Object> {
    return RNFS.readFile(path, 'ascii')
      .then(success => {
        const fileContents = success;
        return JSON.parse(fileContents);
      })
      .catch(err => {
        console.log(err.message);
        return {};
      });
  }
}

export default FileSystemService;
