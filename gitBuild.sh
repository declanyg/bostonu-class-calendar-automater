git rm -r build

cd client

git add --all

echo 'Enter the commit message:'
read commitMessage

git commit -m "$commitMessage"

git push

yarn build

mv build ..

cd ..

git add --all

git commit -m "$commitMessage"

git push

exit 1