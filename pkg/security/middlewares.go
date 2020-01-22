package security

import (
	"fmt"
	"net/http"
	"strconv"
)

// CorsMiddleware enables CORS Request on server (for development purposes)
func CorsMiddleware(next http.Handler, allowedOrigin string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, PROPFIND, MKCOL, MOVE, COPY")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, XSRF-TOKEN, Authorization, Depth, Destination")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		next.ServeHTTP(w, req)
	})
}

// WebSecurityMiddleware adds good practices security headers on http responses
func WebSecurityMiddleware(next http.Handler, source string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		w.Header().Set("Strict-Transport-Security", "max-age=63072000")
		w.Header().Set("Content-Security-Policy", fmt.Sprintf("default-src %[1]v 'self'; img-src %[1]v blob: 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; frame-src %[1]v; frame-ancestors %[1]v", source))
		w.Header().Set("X-Frame-Options", "SAMEORIGIN")
		w.Header().Set("X-XSS-Protection", "1; mode=block")
		w.Header().Set("Referrer-Policy", "same-origin")
		w.Header().Set("X-Content-Type-Options", "nosniff")
		next.ServeHTTP(w, req)
	})
}

// GetFullHostname returns the full hostname of the server
func GetFullHostname(hostname string, port int) string {
	if port == 80 || port == 443 {
		return "https://" + hostname
	}
	return "https://" + hostname + ":" + strconv.Itoa(port)
}
