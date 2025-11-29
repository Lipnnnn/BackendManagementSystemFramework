package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os/exec"
	"runtime"
)

//go:embed dist
var distFiles embed.FS

func main() {
	// 从内嵌文件系统中读取dist目录
	distFS, err := fs.Sub(distFiles, "dist")
	if err != nil {
		log.Fatal("无法加载静态资源:", err)
	}

	// 设置静态文件服务
	fileServer := http.FileServer(http.FS(distFS))
	http.Handle("/", fileServer)

	port := "5173"
	url := fmt.Sprintf("http://localhost:%s", port)

	fmt.Println("========================================")
	fmt.Println("    资产填报工具启动成功！")
	fmt.Println("========================================")
	fmt.Printf("服务器运行在: %s\n", url)
	fmt.Println("正在打开浏览器...")
	fmt.Println("按 Ctrl+C 关闭服务器")
	fmt.Println("========================================")

	// 自动打开浏览器
	go openBrowser(url)

	// 启动HTTP服务器
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatal(err)
	}
}

// 打开系统默认浏览器
func openBrowser(url string) {
	var err error
	switch runtime.GOOS {
	case "windows":
		err = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case "darwin":
		err = exec.Command("open", url).Start()
	default: // linux
		err = exec.Command("xdg-open", url).Start()
	}
	if err != nil {
		log.Println("无法自动打开浏览器，请手动访问:", url)
	}
}
