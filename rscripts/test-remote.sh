echo "copying files to server"
gcloud --project=iarsenic-prep-2019-02 compute scp --zone=europe-west4-a --recurse data *.R *.sh instance-1:auto-tests/

echo
echo "running tests `date`"

gcloud --project=iarsenic-prep-2019-02 compute ssh --zone=europe-west4-a instance-1 -- "cd auto-tests; bash test-parallel-24.sh $@ >output.txt"

echo "done `date`"

echo
echo "copying output"

filecnt=1

while [ -e "output$filecnt.txt" ]
do
  filecnt=$[filecnt+1]
done

gcloud --project=iarsenic-prep-2019-02 compute scp --zone=europe-west4-a instance-1:auto-tests/output.txt "./output$filecnt.txt"

echo "output is in ./output$filecnt.txt"
