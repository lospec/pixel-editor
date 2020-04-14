function isPixelEmpty(pixel) {
    if ((pixel[0] == 0 && pixel[1] == 0 && pixel[2] == 0) || pixel[3] == 0) {
        return true;
    }
	
    return false;
}