# 📋 BẢNG PHÂN RÃ CÔNG VIỆC CHI TIẾT (WORK BREAKDOWN STRUCTURE - WBS)
## DỰ ÁN: ĐI ĐÁM CƯỚI ONLINE 3D

* **Quy tắc phân chia:** Task siêu nhỏ (Micro-tasks, từ 30 phút – 2 giờ/task), độc lập, có tiêu chí hoàn thành (Definition of Done - DoD) rõ ràng để dev làm đến đâu tick đến đó.
* **Tổng số task:** 40 micro-tasks chia làm 6 giai đoạn.

---

## 🏗️ GIAI ĐOẠN 1: SETUP DỰ ÁN & CANVAS 3D (8 Tasks) - [HOÀN THÀNH 8/8]
*Mục tiêu: Dựng xong môi trường lập trình và render được một vật thể 3D đầu tiên chạy mượt mà.*

* [x] **Task 1.1: Khởi tạo project React + Vite**
  * *Mô tả:* Chạy lệnh tạo project với React + JavaScript/TypeScript.
  * *DoD:* Chạy `npm run dev` hiển thị trang chào mừng của Vite.
* [x] **Task 1.2: Cài đặt & cấu hình Tailwind CSS**
  * *Mô tả:* Cài đặt Tailwind, cấu hình `tailwind.config.js` và `@tailwind` trong file `index.css`.
  * *DoD:* Dùng thử class `bg-red-500` hiển thị đúng màu nền.
* [x] **Task 1.3: Cài đặt các thư viện 3D & Tiện ích**
  * *Mô tả:* Cài đặt `three`, `@react-three/fiber`, `@react-three/drei`, `gsap`, `howler`, `lucide-react`, `clsx`, `tailwind-merge`.
  * *DoD:* File `package.json` có đủ các dependency trên mà không bị xung đột phiên bản.
* [x] **Task 1.4: Tạo cấu trúc thư mục dự án chuẩn**
  * *Mô tả:* Tạo cây thư mục:
    * `src/components/3d/` (Các scene & model 3D)
    * `src/components/ui/` (Các nút bấm, modal 2D)
    * `src/hooks/` (Custom hook quản lý âm thanh, socket)
    * `src/store/` (State lưu trữ thông tin khách)
    * `public/models/`, `public/sounds/`, `public/textures/`, `public/draco/`
  * *DoD:* Cây thư mục được tạo đầy đủ.
* [x] **Task 1.5: Cấu hình bộ giải nén Draco Decoder**
  * *Mô tả:* Tải bộ file `draco_decoder.wasm` và `draco_wasm_wrapper.js` từ Three.js đặt vào thư mục `public/draco/`.
  * *DoD:* Trình duyệt truy cập được link `http://localhost:5173/draco/draco_decoder.wasm`.
* [x] **Task 1.6: Dựng component Canvas 3D cơ bản (`WeddingCanvas.jsx`)**
  * *Mô tả:* Tạo component bọc thẻ `<Canvas>` của R3F, cấu hình camera perspective `fov: 45`, `dpr={[1, 2]}` (giới hạn pixel ratio cho mobile).
  * *DoD:* Canvas phủ kín màn hình 100vw x 100vh, responsive khi đổi kích thước cửa sổ.
* [x] **Task 1.7: Tạo hệ thống chiếu sáng tiệc cưới (`Lighting.jsx`)**
  * *Mô tả:* Thêm `ambientLight` màu vàng kem ấm áp và `directionalLight` chiếu xiên nhẹ để tạo khối 3D.
  * *DoD:* Không gian có ánh sáng dịu, không bị chói gắt hoặc tối đen.
* [x] **Task 1.8: Render vật thể thử nghiệm kiểm tra 60 FPS**
  * *Mô tả:* Đặt 1 khối hộp (Cube) tự động xoay ở giữa Canvas, bật `r3f-perf` hoặc đo FPS.
  * *DoD:* Khối hộp xoay mượt mà đạt 60 FPS trên cả máy tính và trình duyệt di động.

---

## 👗 GIAI ĐOẠN 2: SCENE 1 - CỔNG CƯỚI & PHÒNG THAY ĐỒ 3D (8 Tasks) - [HOÀN THÀNH 8/8]
*Mục tiêu: Người chơi nhập tên, xoay nhân vật 360°, đổi được trang phục và bấm vào tiệc.*

* [x] **Task 2.1: Tạo State quản lý thông tin khách (`useGuestStore.js` / `useWeddingStore.js`)**
  * *Mô tả:* Tạo Zustand store lưu: `{ guestName, guestRole, selectedOutfit, selectedAccessory, currentScene }`.
  * *DoD:* Cập nhật được state và các component khác đọc được dữ liệu.
* [x] **Task 2.2: Dựng bục xoay 3D (`Pedestal.jsx`)**
  * *Mô tả:* Mô hình hình trụ dẹt tròn dập hoa văn chữ Hỷ làm bục đứng cho nhân vật, có vòng sáng lơ lửng và bóng mờ.
  * *DoD:* Bục tròn nằm ở tọa độ `[0, -0.4, 0]`, có màu đỏ đô kết hợp viền vàng kim.
* [x] **Task 2.3: Tải mô hình nhân vật Chibi 3D (`ChibiCharacter.jsx`)**
  * *Mô tả:* Dựng nhân vật Chibi 3D bằng code (procedural) với animation thở và đung đưa nhẹ (Idle).
  * *DoD:* Nhân vật xuất hiện trên bục, tự động nhún nhảy vui vẻ.
* [x] **Task 2.4: Điều khiển xoay 360 độ nhân vật**
  * *Mô tả:* Dùng `OrbitControls` khóa góc nâng (polar angle), chỉ cho phép xoay ngang quanh nhân vật khi vuốt màn hình.
  * *DoD:* Người dùng vuốt trái/phải để ngắm nhân vật 360 độ mà không làm lật ngược camera.
* [x] **Task 2.5: UI nhập tên & chọn danh xưng (`NameInputModal.jsx`)**
  * *Mô tả:* Form nhập tên + danh xưng qua chips: *Bạn Cô Dâu*, *Bạn Chú Rể*, *Người Yêu Cũ*, *Hội FA*.
  * *DoD:* Lưu tên và danh xưng vào store, validate không cho để trống tên.
* [x] **Task 2.6: Bộ chọn trang phục 3D (`OutfitSelector.jsx`)**
  * *Mô tả:* 4 nút bấm đổi set đồ: *Vest bảnh*, *Váy dạ hội*, *Áo dài*, *Áo thun quần đùi*. Đổi trực tiếp trên 3D.
  * *DoD:* Bấm nút nào thì nhân vật trên bục đổi màu/set đồ tương ứng ngay lập tức.
* [x] **Task 2.7: Bộ chọn phụ kiện hài hước (`AccessorySelector.jsx`)**
  * *Mô tả:* Bật/tắt các phụ kiện: Kính râm đen ngầu, Bó hoa cưới, Ly bia sủi bọt.
  * *DoD:* Bấm chọn phụ kiện -> Phụ kiện xuất hiện trên nhân vật Chibi.
* [x] **Task 2.8: Nút "VÀO TIỆC" & Mở khóa Audio (`EnterButton.jsx` + `soundManager.js`)**
  * *Mô tả:* Nút bấm to màu đỏ rực rỡ ở đáy màn hình. Khi click: Khởi tạo AudioContext của Howler.js, phát âm thanh chúc mừng và chuyển sang Scene 2.
  * *DoD:* Bấm nút không bị lỗi chặn âm thanh trên Safari iOS; giao diện chuyển cảnh mượt mà.

---

## 🏛️ GIAI ĐOẠN 3: SCENE 2 - TOÀN CẢNH SẢNH TIỆC & CHỌN BÀN (7 Tasks) - [HOÀN THÀNH 7/7]
*Mục tiêu: Hiển thị sảnh tiệc cưới lung linh, bấm chọn ghế trống thì camera bay vèo vào ghế.*

* [x] **Task 3.1: Dựng sảnh tiệc cưới 3D (`HallEnvironment.jsx`)**
  * *Mô tả:* Sàn đá bóng bẩy, sân khấu phía xa có tháp bánh kem 3 tầng, tháp ly champagne, trụ hoa đỏ vàng.
  * *DoD:* Toàn cảnh sảnh tiệc cưới hiện lên ấm cúng.
* [x] **Task 3.2: Dựng cụm Bàn tiệc tròn (`WeddingTableMesh.jsx`)**
  * *Mô tả:* 1 bàn tròn phủ khăn đỏ viền vàng, mâm xoay kính tròn, xếp 6 chiếc ghế xung quanh.
  * *DoD:* Component bàn tiệc nhận props `position` và render chuẩn tỉ lệ.
* [x] **Task 3.3: Nhân bản 6 bàn tiệc trong sảnh tiệc**
  * *Mô tả:* Xếp 6 bàn tiệc theo 2 hàng (3 bàn mỗi hàng), tối ưu draw call.
  * *DoD:* 6 bàn tiệc xuất hiện cùng lúc với các bạn bè đang ngồi.
* [x] **Task 3.4: Gắn biển tên 3D trên từng bàn (`TableLabel.jsx`)**
  * *Mô tả:* Dùng `<Html>` billboard treo trên đỉnh mỗi bàn: *Mâm Cấp 3*, *Mâm FA*, *Mâm Đồng Nghiệp*, *Mâm Nhậu Tới Bến*... kèm số ly đã cạn.
  * *DoD:* Biển tên hiển thị rõ ràng, luôn quay mặt về phía camera.
* [x] **Task 3.5: Hiển thị ghế trống và ghế đã có người**
  * *Mô tả:* Ghế đã có người ngồi hiển thị avatar chibi mini; ghế trống hiển thị vòng sáng xanh ngọc `(+)`.
  * *DoD:* Người dùng phân biệt được ghế nào còn trống để bấm vào.
* [x] **Task 3.6: Bắt sự kiện chọn ghế bằng Raycaster**
  * *Mô tả:* Bắt sự kiện `onClick` vào ghế trống, lưu ghế và bàn đã chọn vào store.
  * *DoD:* Click vào ghế trống kích hoạt hàm `selectSeatAndEnterTable(tableId, seatIndex)`.
* [x] **Task 3.7: Animation Camera chuyển cảnh vào ghế ngồi**
  * *Mô tả:* Camera chuyển đổi mượt mà giữa góc toàn cảnh sảnh tiệc rơi thẳng vào bàn tiệc đã chọn.
  * *DoD:* Camera di chuyển mượt mà, chuyển sang Scene 3.

---

## 🍻 GIAI ĐOẠN 4: SCENE 3 - BÀN TIỆC, CỤNG LY & MÂM CỖ CƯỚI (9 Tasks) - [HOÀN THÀNH 9/9]
*Mục tiêu: Hoàn thiện trải nghiệm "ăn cỗ ảo" - lên món ăn, cụng ly leng keng tóe bọt, mở phong bì VietQR.*

* [x] **Task 4.1: Thiết lập góc nhìn cận cảnh Bàn tiệc (`TableFocusScene.jsx`)**
  * *Mô tả:* Camera đặt trực diện mâm cỗ tròn, thấy các nhân vật bạn bè ngồi xung quanh.
  * *DoD:* Nhìn thấy rõ mặt bàn tròn, mâm xoay, đĩa cỗ, ly bia và bao lì xì.
* [x] **Task 4.2: Dựng nút bấm & State quản lý món ăn (`serveNextDish`)**
  * *Mô tả:* Lưu danh sách món ăn đang có trên mâm. Nút UI: **"LÊN MÓN TIẾP"**.
  * *DoD:* Mỗi lần bấm nút, thêm 1 món lên mâm xoay.
* [x] **Task 4.3: Mô hình 3D đĩa Gà Luộc Chặt Miếng Lá Chanh & Bát Canh Bóng Thập Cẩm (`RoastChickenDish.jsx`, `BanquetSoupBowl.jsx`)**
  * *Mô tả:* Đĩa gà chặt miếng vàng ươm mỡ gà, hai đùi gà bắt chéo, rắc lá chanh thái chỉ, kèm đĩa muối tiêu chanh ớt. Ở chính tâm mâm xoay là Tô Canh Bóng Thập Cẩm sâu lòng ngập tràn mọc thịt, nấm hương, cà rốt tỉa hoa và làn khói ấm bốc lên.
  * *DoD:* Đĩa sứ cao cấp viền chỉ vàng ôm khít đĩa, không bị đè viền hay va chạm.
* [x] **Task 4.4: Mâm cỗ 6 món cưới truyền thống Việt Nam đầy đặn (`SteamedShrimpDish.jsx`, `StickyRiceDish.jsx`, `CrispySpringRollsDish.jsx`, `FestiveSaladDish.jsx`)**
  * *Mô tả:* Mở rộng mâm cỗ thành bộ 6 món kinh điển: 1. Tô Canh Bóng Thập Cẩm (tâm mâm xoay), 2. Đĩa Gà Luộc Lá Chanh, 3. Đĩa Tôm Sú Hấp Nước Dừa xòe quạt, 4. Đĩa Xôi Gấc Hạt Sen Chữ Hỷ (囍), 5. Đĩa Nem Rán Hà Nội Vàng Ruộm giòn tan kèm bát nước mắm chua ngọt, 6. Đĩa Nộm Ngó Sen Tôm Thịt rắc lạc rang thơm bùi và ớt tỉa hoa.
  * *DoD:* Toàn bộ 6 đĩa cỗ bài trí lục giác đều đặn, khoảng cách thông thoáng 19cm giữa các đĩa, sạch hoàn toàn lỗi đè vành khuyên kim loại.
* [x] **Task 4.5: Hiệu ứng hạt khói nóng bốc lên (`DishSteamParticles.jsx`)**
  * *Mô tả:* Tạo các hạt khói mờ bay lơ lửng từ đĩa thức ăn lên trên rồi tan biến.
  * *DoD:* Món ăn trông nóng hổi, sống động như thật.
* [x] **Task 4.6: Tương tác gắp thức ăn & Âm thanh nhồm nhoàm (`soundManager.playEat()`, `eatDish()`)**
  * *Mô tả:* Bấm vào bất kỳ đĩa thức ăn nào trên bàn -> Phát âm thanh gắp ăn "Nhoàm nhoàm!" vui tai + thanh "Độ no bụng" tăng dần lên 100%.
  * *DoD:* Gắp thức ăn phản hồi lập tức cả hình ảnh con trỏ chuột pointer lẫn âm thanh gắp ăn.
* [x] **Task 4.7: Nút bấm lớn "CỤNG LY 🍻" & Animation va ly 3D (`BeerMugMesh.jsx`)**
  * *Mô tả:* Nút bấm vàng nổi bật ở đáy màn hình. Khi bấm: cả 6 ly bia trên bàn cùng nâng lên, nghiêng và chụm va vào nhau.
  * *DoD:* Hoạt ảnh các ly va chạm vào nhau đồng bộ, mượt mà.
* [x] **Task 4.8: Âm thanh hô hào thực tế "Hai ba dô! Hai ba dô! Hai ba uống!" & Đồng bộ va ly (`cheers_chant.mp3` + `CheersSparks.jsx` + `soundManager.playCheersChant()` + `TableOverlay.jsx`)**
  * *Mô tả:* Tích hợp file âm thanh hô hào thực tế của người dùng (`cheers_chant.mp3`, `cheers_chant.m4a`, `cheers_chant.wav`). Đồng bộ chính xác từng đỉnh sóng âm thanh: Nhịp 1 (`1.25s`) va ly "Hai ba DÔ!", Nhịp 2 (`2.25s`) va ly "Hai ba DÔ!", Nhịp 3 (`3.35s`) va ly "Hai ba UỐNG!" bùng nổ pháo hoa và fanfare mừng rỡ, cùng banner toast hiển thị câu chữ "HAI... BA... ZÔ! / UỐNG!".
  * *DoD:* Âm thanh chân thực, sống động, khớp nhịp 100% với hoạt ảnh 3D ly bia va chạm và pháo hoa bùng sáng.
* [x] **Task 4.9: Bao lì xì 3D trồi mã VietQR mừng cưới (`RedEnvelope3D.jsx` + `VietQRModal.jsx`)**
  * *Mô tả:* Bao lì xì đỏ may mắn dập chữ Hỷ đặt trên bàn. Bấm vào bao lì xì -> Hiện Modal VietQR chọn mức tiền (68k, 168k, 500k, 999k) có sẵn cú pháp mừng cưới.
  * *DoD:* Quét bằng app ngân hàng đọc đúng thông tin tài khoản và số tiền mừng cưới.
* [x] **Task 4.10: Khung chat bàn tiệc & Bóng thoại nổi 3D trên đầu nhân vật (`TableOverlay.jsx` + `TableFocusScene.jsx`)**
  * *Mô tả:* Thanh nhập tin nhắn và hàng nút lời chúc nhanh (1-tap pills) ở đáy màn hình bàn tiệc. Khi gửi tin nhắn, bóng thoại comic viền vàng nổi ngay trên đầu nhân vật 3D, hiển thị tên người gửi và nội dung chúc mừng. Bạn bè cùng bàn tự động đối đáp rôm rả.
  * *DoD:* Tin nhắn hiển thị rõ ràng, neo chuẩn xác trên đỉnh đầu nhân vật và tự động biến mất sau 6 giây.

---

## 🌐 GIAI ĐOẠN 5: REALTIME ĐỒNG BỘ BẠN BÈ (5 Tasks) - [HOÀN THÀNH 5/5]
*Mục tiêu: 2 người dùng mở 2 máy khác nhau có thể ngồi cùng 1 bàn và thấy nhau cụng ly.*

* [x] **Task 5.1: Khởi tạo Socket.io Server Node.js (`server/index.js`)**
  * *Mô tả:* Tạo server Express + Socket.io trên port 3001, cấu hình CORS và proxy Vite `/socket.io`.
  * *DoD:* Client kết nối thành công, terminal server log ra `user connected`, hiển thị trạng thái `Realtime Online 🟢`.
* [x] **Task 5.2: Quản lý State phòng cưới & Ghế ngồi trên Server (`server/index.js`)**
  * *Mô tả:* Quản lý Map `rooms[weddingId].tables[tableId].seats` với cơ chế khóa ghế nguyên tử (Mutex).
  * *DoD:* Lưu trữ được danh sách ai đang ngồi ở ghế nào, tự động giải phóng ghế khi khách rời bàn/mất kết nối.
* [x] **Task 5.3: Sự kiện `seat:claim` & `table:seat_updated` thời gian thực**
  * *Mô tả:* Khi máy A chọn ghế -> Phát socket lên server -> Server broadcast cho máy B -> Máy B tự động vẽ avatar 3D của máy A vào đúng chiếc ghế đó.
  * *DoD:* Mở 2 tab trình duyệt: Tab 1 chọn ghế thì Tab 2 lập tức thấy người ngồi vào cùng trang phục và tên gọi.
* [x] **Task 5.4: Sự kiện `table:cheers` & `table:cheers_wave` đồng bộ cụng ly**
  * *Mô tả:* Khi 1 người ở bàn bấm nút "CỤNG LY" -> Server broadcast cho cả bàn -> Tất cả các máy cùng rung chuông phát tiếng hô "Hai ba Zô", cụng ly 3D và nổ pháo hoa đồng thời.
  * *DoD:* Bấm cụng ly ở Tab 1 thì Tab 2 cũng tự động va ly và nổ bọt bia.
* [x] **Task 5.5: Sự kiện `table:serve_dish`, `table:chat` & `table:rename` đồng bộ mâm tiệc**
  * *Mô tả:* Dọn món cỗ, đổi tên bàn tiệc và gửi bóng thoại tin nhắn được đồng bộ thời gian thực cho mọi người cùng bàn.
  * *DoD:* Cả bàn cùng nhìn thấy món ăn dọn lên, tên bàn đổi mới và bóng thoại chat nổi lên đầu người gửi đồng thời.

---

## 🚀 GIAI ĐOẠN 6: TỐI ƯU MOBILE, XUẤT THẺ KỶ NIỆM & DEPLOY (4 Tasks) - [HOÀN THÀNH 4/4]
*Mục tiêu: Đóng gói sản phẩm hoàn thiện, chạy ổn định trên điện thoại và triển khai lên internet.*

* [x] **Task 6.1: Tối ưu hiệu năng & Bộ nhớ WebGL di động**
  * *Mô tả:* Kiến trúc 3D dạng Compound Procedural Geometries không phụ thuộc file GLTF nặng bên ngoài, DPR giới hạn $\le 1.75$ cho màn hình Retina mobile, tắt shadow maps tốn kém, dọn dẹp bộ nhớ tự động, dung lượng gzipped client chỉ ~511KB (< 1MB).
  * *DoD:* Tổng dung lượng tải trang cực nhẹ (< 1MB gzipped, thấp hơn nhiều mục tiêu < 5MB); 60 FPS mượt mà trên mobile WebGL.
* [x] **Task 6.2: Tạo tính năng xuất "Thẻ chứng nhận ăn cỗ online" (`CertificateModal.jsx`)**
  * *Mô tả:* Canvas 2D độ phân giải cao $1080 \times 1350\text{px}$ (tỉ lệ 4:5 tối ưu cho Story/Post Facebook & Instagram) với nền gấm đỏ nhung, khung viền hoa văn vàng kim, chữ Hỷ 囍, thông tin khách mời, vai trò, mâm tiệc, số ly đã cụng, độ no bụng %, dấu mộc sáp đỏ danh dự, và nút bấm tải file `.png` sắc nét cùng nút sao chép link chia sẻ.
  * *DoD:* Xuất ra file ảnh `.png` $1080 \times 1350\text{px}$ chuẩn nét, sẵn sàng tải về máy và đăng Story Facebook/Instagram.
* [x] **Task 6.3: Deploy Backend WebSocket lên Railway / Render (`server/index.js`, `Procfile`)**
  * *Mô tả:* Chuẩn bị cấu hình server Express + Socket.io đa chế độ: hỗ trợ cả standalone websocket server và monolithic full-stack server (tự động serve thư mục `dist/`), tạo file `Procfile` và biến môi trường `PORT`, `VITE_SOCKET_URL`.
  * *DoD:* Server sẵn sàng 1-click deploy lên Railway, Render hoặc Fly.io, kết nối `wss://` mượt mà.
* [x] **Task 6.4: Deploy Frontend lên Vercel / Netlify & Kiểm thử nghiệm thu (`vercel.json`, build production)**
  * *Mô tả:* Tạo cấu hình `vercel.json` định tuyến SPA rewrites, cache-control tối ưu cho static assets, kiểm thử `npm run build` thành công 100% không lỗi.
  * *DoD:* Toàn bộ dự án build production sạch (exit code 0), sẵn sàng triển khai công khai.
