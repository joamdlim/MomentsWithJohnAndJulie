import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Upload Flow', () => {
  test('should login and upload a photo successfully', async ({ page }) => {
    // 1. Navigate directly to the 'mine' tab to skip the splash screen
    await page.goto('/?tab=mine');
    
    // 2. Click the 'Sign in with Google' button in the UI to open the AuthModal
    // (This button triggers the onLoginClick handler)
    await page.getByRole('button', { name: /Sign in with Google/i }).click();

    // 3. Inside the AuthModal, click the option to use username
    await page.getByRole('button', { name: /Login \/ Register with username/i }).click();

    // 3. Register/Login a test user
    const testUser = `testuser_${Date.now()}`;
    await page.getByRole('button', { name: /Don't have an account\? Register/i }).click();
    await page.getByPlaceholder('Username').fill(testUser);
    await page.getByPlaceholder('Password').fill('testpassword123');
    await page.getByRole('button', { name: 'Register', exact: true }).click();

    // 4. Create a folder if one doesn't exist
    // After login, we should see "Plant your bouquet"
    const folderInput = page.getByPlaceholder('Folder name');
    await expect(folderInput).toBeVisible({ timeout: 10000 });
    await folderInput.fill('Test Folder');
    await page.getByRole('button', { name: 'Create folder' }).click();

    // Wait for folder to be created
    await expect(page.getByText('Test Folder')).toBeVisible({ timeout: 15000 });

    // 5. Upload a photo
    // We need to click the Gallery button which opens the file picker
    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: /Gallery/i }).click();
    const fileChooser = await fileChooserPromise;
    
    // Set the file to our test asset
    const testAssetPath = path.join(process.cwd(), 'test-assets', 'sample.jpg');
    await fileChooser.setFiles(testAssetPath);

    // 6. Verify upload success
    // Wait for the loader to disappear and image to be visible
    // Depending on UI, you might have a toast or just see the new image
    // For now, we wait for "Uploading..." to revert to "Gallery"
    await expect(page.getByRole('button', { name: /Wait.../i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Gallery/i })).toBeVisible({ timeout: 20000 });
    
    // Clean up: delete folder to not clutter the DB
    page.on('dialog', dialog => dialog.accept()); // auto-accept confirm dialog
    await page.getByRole('button', { name: /Delete Folder/i }).click();
  });
});
