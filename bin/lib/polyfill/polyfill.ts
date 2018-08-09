import { addPolyfillAssets } from './add-polyfill-assets';
import { updateIndexFiles } from './update-index-files';

export async function polyfill(appNames: string[] = []) {
  await addPolyfillAssets(appNames);
  await updateIndexFiles(appNames);
}
