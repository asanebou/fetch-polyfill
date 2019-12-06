describe('Headers', function () {
    'use strict';
    it('Headers_keys', function () {
        let headers = new asanebou.Headers();
        headers.append('Accept-Encoding', 'gzip')
        headers.append('Accept-Encoding', 'deflate')
        headers.append('Accept-Language', 'zh-cn')
        headers.append('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:12.0) Gecko/20100101')

        let i = 0;
        let keys = [];
        for (let key of headers.keys()) {
            keys.push(key);
        }

        expect(keys.sort().join(',').toLowerCase()).toBe('Accept-Encoding,Accept-Encoding,Accept-Language,User-Agent'.toLowerCase());
    });
});