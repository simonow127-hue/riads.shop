$git = "C:\Program Files\Git\cmd\git.exe"

$env:GIT_AUTHOR_NAME    = "riads-store"
$env:GIT_COMMITTER_NAME = "riads-store"
$env:GIT_AUTHOR_EMAIL    = "riads@users.noreply.github.com"
$env:GIT_COMMITTER_EMAIL = "riads@users.noreply.github.com"

& $git -C "c:\Users\HP\Projects\riads-store\frontend" add lib/products.ts components/product/ProductPageClient.tsx
& $git -C "c:\Users\HP\Projects\riads-store\frontend" commit -m "Add real neck-fan reviews with globe-sourced UI section"
& $git -C "c:\Users\HP\Projects\riads-store\frontend" push origin main
& $git -C "c:\Users\HP\Projects\riads-store\frontend" status
