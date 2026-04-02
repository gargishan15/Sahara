export default {
	async fetch(request) {
		const url = new URL(request.url);
		const path = url.pathname;
		const method = request.method;

		const BACKEND_URL = "https://sahara-backend-6kjh.onrender.com";

		const headers = {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization, token, atoken"
		};

		
		if (method === "OPTIONS") {
			return new Response(null, { headers });
		}

		
		if (path === "/") {
			return new Response("Sahara API running on Cloudflare 🚀");
		}

		
		if (
			path === "/api/user/register" ||
			path === "/api/user/login" ||
			path === "/api/user/get-profile"
		) {
			const response = await fetch(BACKEND_URL + path, {
				method,
				headers: {
					"Content-Type": "application/json",
					"token": request.headers.get("token") || "",
					"atoken": request.headers.get("atoken") || ""
				},
				body: request.body
			});

			const data = await response.text();

			return new Response(data, {
				status: response.status,
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type, Authorization, token, atoken"
				}
			});
		}

		

		if (
			path === "/api/user/update-profile" ||
			path === "/api/user/book-appointment" ||
			path === "/api/user/cancel-appointment" ||
			path === "/api/user/appointments"
		) {
			const response = await fetch(BACKEND_URL + path, {
				method,
				headers: request.headers,
				body: request.body
			});

			const data = await response.text();

			return new Response(data, {
				status: response.status,
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type, Authorization, token, atoken"
				}
			});
		}

		if (
			path === "/api/user/payment-razorpay" ||
			path === "/api/user/verifyRazorpay"
		) {
			const response = await fetch(BACKEND_URL + path, {
				method,
				headers: {
					"Content-Type": "application/json",
					"token": request.headers.get("token") || ""
				},
				body: request.body
			});

			const data = await response.text();

			return new Response(data, {
				status: response.status,
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Headers": "Content-Type, token"
				}
			});
		}
		

		
		if (path === "/api/doctor/list") {
			return fetch(BACKEND_URL + path, {
				method,
				headers: request.headers
			});
		}

		if (path === "/api/doctor/login") {
			return fetch(BACKEND_URL + path, {
				method,
				headers: request.headers,
				body: request.body
			});
		}

		
		if (path.startsWith("/api/doctor")) {
			return fetch(BACKEND_URL + path, {
				method,
				headers: request.headers,
				body: request.body
			});
		}

		
		if (path === "/api/admin/login") {
			return fetch(BACKEND_URL + path, {
				method,
				headers: request.headers,
				body: request.body
			});
		}

		
		if (path.startsWith("/api/admin")) {
			return fetch(BACKEND_URL + path, {
				method,
				headers: request.headers,
				body: request.body
			});
		}

		
		return new Response("Not Found", { status: 404 });
	}
};
