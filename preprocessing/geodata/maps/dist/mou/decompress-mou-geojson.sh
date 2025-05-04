cat mou-geojson.tar.gz.a* > mou-geojson.tar.gz
tar -xf mou-geojson.tar.gz
mv mou-geojson/* ./
rmdir mou-geojson
rm mou-geojson.tar.gz
