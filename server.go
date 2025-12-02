package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"sync/atomic"
	"time"
)

//go:embed dist
var distFiles embed.FS

// 记录最后一次访问时间
var lastAccessTime atomic.Value

func main() {
	port := "8000"
	url := fmt.Sprintf("http://localhost:%s", port)

	// 检查端口是否已被占用
	if isPortInUse(port) {
		// 端口已被占用，说明程序已在运行，直接打开浏览器
		openBrowser(url)
		return
	}

	// 从内嵌文件系统中读取dist目录
	distFS, err := fs.Sub(distFiles, "dist")
	if err != nil {
		log.Fatal("无法加载静态资源:", err)
	}

	// 设置静态文件服务（带访问记录和禁用缓存）
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// 更新最后访问时间
		lastAccessTime.Store(time.Now())
		
		// SPA路由支持：检查请求的文件是否存在
		path := r.URL.Path
		if path == "/" {
			path = "index.html"
		} else {
			path = path[1:] // 移除开头的 /
		}
		
		// 尝试打开文件
		if _, err := fs.Stat(distFS, path); err != nil {
			// 文件不存在，返回 index.html（用于SPA路由）
			path = "index.html"
		}
		
		// 读取文件内容
		data, err := fs.ReadFile(distFS, path)
		if err != nil {
			http.Error(w, "File not found", http.StatusNotFound)
			return
		}
		
		// 设置Content-Type（必须在写入数据之前）
		contentType := getContentType(path)
		w.Header().Set("Content-Type", contentType)
		
		// 设置禁用缓存的响应头
		w.Header().Set("Cache-Control", "no-cache, no-store, must-revalidate")
		w.Header().Set("Pragma", "no-cache")
		w.Header().Set("Expires", "0")
		
		w.Write(data)
	})

	fmt.Println("========================================")
	fmt.Println("    资产填报工具启动成功！")
	fmt.Println("========================================")
	fmt.Printf("服务器运行在: %s\n", url)
	fmt.Println("正在打开浏览器...")
	fmt.Println("按 Ctrl+C 关闭服务器")
	fmt.Println("========================================")

	// 启动HTTP服务器（在goroutine中）
	go func() {
		if err := http.ListenAndServe(":"+port, nil); err != nil {
			log.Fatal("服务器启动失败:", err)
		}
	}()

	// 等待服务器启动后打开浏览器
	time.Sleep(500 * time.Millisecond)
	// 初始化最后访问时间
	lastAccessTime.Store(time.Now())
	openBrowser(url)

	// 启动监控线程，如果30秒没有访问则退出
	go func() {
		ticker := time.NewTicker(5 * time.Second)
		defer ticker.Stop()
		for range ticker.C {
			if lastAccess, ok := lastAccessTime.Load().(time.Time); ok {
				if time.Since(lastAccess) > 30*time.Second {
					fmt.Println("浏览器已关闭，程序退出")
					os.Exit(0)
				}
			}
		}
	}()

	// 保持程序运行
	select {}
}

// 检查端口是否被占用
func isPortInUse(port string) bool {
	ln, err := net.Listen("tcp", ":"+port)
	if err != nil {
		return true
	}
	ln.Close()
	return false
}

// 根据文件扩展名获取Content-Type
func getContentType(path string) string {
	ext := strings.ToLower(filepath.Ext(path))
	switch ext {
	case ".html":
		return "text/html; charset=utf-8"
	case ".css":
		return "text/css; charset=utf-8"
	case ".js":
		return "application/javascript; charset=utf-8"
	case ".json":
		return "application/json; charset=utf-8"
	case ".png":
		return "image/png"
	case ".jpg", ".jpeg":
		return "image/jpeg"
	case ".svg":
		return "image/svg+xml"
	case ".ico":
		return "image/x-icon"
	default:
		return "application/octet-stream"
	}
}

// 打开系统默认浏览器
func openBrowser(url string) {
	var cmd *exec.Cmd
	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("cmd", "/c", "start", url)
	case "darwin":
		cmd = exec.Command("open", url)
	default: // linux
		cmd = exec.Command("xdg-open", url)
	}
	err := cmd.Start()
	if err != nil {
		log.Println("无法自动打开浏览器，请手动访问:", url)
	}
}
