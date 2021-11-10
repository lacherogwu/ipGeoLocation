import Aigle from 'aigle';
import axios from 'axios';
import _ from 'lodash';

const wrapper = promise => () => promise().catch(() => new Promise(() => {}));

const abstractapi = wrapper(async () => {
	const { data } = await axios.get('https://ipgeolocation.abstractapi.com/v1/?api_key=bf0aa4d54c2947ca91652efd1563d929');
	const { ip_address: ip, country_code: countryCode } = data;
	return { ip, countryCode, api: 'abstractapi' };
});

const bigdatacloud = wrapper(async () => {
	const { data } = await axios.get('https://api.bigdatacloud.net/data/ip-geolocation?key=2c40fba2a21548f0b26b0ec2dadbccc4');
	const {
		ip,
		country: { isoAlpha2: countryCode },
	} = data;
	return { ip, countryCode, api: 'bigdatacloud' };
});

const cloudflare = wrapper(async () => {
	const { data } = await axios.get('https://www.cloudflare.com/cdn-cgi/trace');

	const values = _(data)
		.split('\n')
		.transform((object, string) => {
			const [key, value] = _.split(string, '=');
			if (!(key && value)) return;
			object[key] = value;
		}, {})
		.value();

	const { ip, loc: countryCode } = values;
	return { ip, countryCode, api: 'cloudflare' };
});

const dbIp = wrapper(async () => {
	const { data } = await axios.get('https://api.db-ip.com/v2/free/self');
	const { ipAddress: ip, countryCode } = data;
	return { ip, countryCode, api: 'dbIp' };
});

const ipApi = wrapper(async () => {
	const { data } = await axios.get('http://ip-api.com/json');
	const { query: ip, countryCode } = data;
	return { ip, countryCode, api: 'ipApi' };
});

const geoiplookup = wrapper(async () => {
	const { data } = await axios.get('https://json.geoiplookup.io/');
	const { ip, country_code: countryCode } = data;
	return { ip, countryCode, api: 'geoiplookup' };
});

const geoplugin = wrapper(async () => {
	const { data } = await axios.get('http://geoplugin.net/json.gp');
	const { geoplugin_request: ip, geoplugin_countryCode: countryCode } = data;
	return { ip, countryCode, api: 'geoplugin' };
});

const ipapiCo = wrapper(async () => {
	const { data } = await axios.get('https://ipapi.co/json/');
	const { ip, country_code: countryCode } = data;
	return { ip, countryCode, api: 'ipapiCo' };
});

const ipdata = wrapper(async () => {
	const { data } = await axios.get('https://api.ipdata.co/?api-key=df262b920b3cde99a8dccdeb74ed89fb20351efca0b8ef19e68a15a1');
	const { ip, country_code: countryCode } = data;
	return { ip, countryCode, api: 'ipdata' };
});

const ipfind = wrapper(async () => {
	const { data } = await axios.get('https://ipfind.co/me?auth=e813ff1d-0e8c-4a3a-9407-2689115dbfa4');
	const { ip_address: ip, country_code: countryCode } = data;
	return { ip, countryCode, api: 'ipfind' };
});

const ipgeolocation = wrapper(async () => {
	const { data } = await axios.get('https://api.ipgeolocation.io/ipgeo?apiKey=a892da3a5dcc4ebf9b0e1f288115729c');
	const { ip, country_code2: countryCode } = data;
	return { ip, countryCode, api: 'ipgeolocation' };
});

const ipinfo = wrapper(async () => {
	const { data } = await axios.get('https://ipinfo.io/json');
	const { ip, country: countryCode } = data;
	return { ip, countryCode, api: 'ipinfo' };
});

const ipregistry = wrapper(async () => {
	const { data } = await axios.get('https://api.ipregistry.co/?key=tkr2rtjzvw82m6yi');
	const {
		ip,
		location: {
			country: { code: countryCode },
		},
	} = data;
	return { ip, countryCode, api: 'ipregistry' };
});

const getIpGeoLocation = async () => {
	const promises = [abstractapi(), bigdatacloud(), cloudflare(), dbIp(), ipApi(), geoiplookup(), geoplugin(), ipapiCo(), ipdata(), ipfind(), ipgeolocation(), ipinfo(), ipregistry()];

	return await Aigle.race(promises);
};

export { getIpGeoLocation };
