# for the old prep project
# PROJECT=iarsenic-prep-2019-02
# ZONE=europe-west4-a
# INSTANCE=instance-1
# SCRIPT=test-parallel-24.sh

# for the real project
PROJECT=uop-iarsenic-01
ZONE=europe-west4-a
INSTANCE=highcpu
SCRIPT=test-parallel-96.sh

echo "copying files to server"
gcloud --project="$PROJECT" compute scp --zone="$ZONE" --recurse data *.R *.sh "$INSTANCE":auto-tests/

echo
echo "running tests `date`"

gcloud --project="$PROJECT" compute ssh --zone="$ZONE" "$INSTANCE" -- "cd auto-tests; bash $SCRIPT $@ >output.txt"

echo "done `date`"

echo
echo "copying output"

filecnt=1

while [ -e "output$filecnt.txt" ]
do
  filecnt=$[filecnt+1]
done

gcloud --project="$PROJECT" compute scp --zone="$ZONE" "$INSTANCE":auto-tests/output.txt "./output$filecnt.txt"

echo "output is in ./output$filecnt.txt"
