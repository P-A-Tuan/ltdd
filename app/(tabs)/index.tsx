import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// ===============================
// DỮ LIỆU SÁCH
// ===============================

const books = [
  {
    id: 1,
    title: 'Lập trình C',
    author: 'Nguyễn Văn A',
    category: 'Lập trình',
    status: 'active',
  },
  {
    id: 2,
    title: 'Lập trình Java',
    author: 'Trần Văn B',
    category: 'Lập trình',
    status: 'active',
  },
  {
    id: 3,
    title: 'React Native cơ bản',
    author: 'Lê Văn C',
    category: 'Di động',
    status: 'active',
  },
  {
    id: 4,
    title: 'Cơ sở dữ liệu',
    author: 'Phạm Văn D',
    category: 'Cơ sở dữ liệu',
    status: 'active',
  },
  {
    id: 5,
    title: 'Mạng máy tính',
    author: 'Hoàng Văn E',
    category: 'Mạng',
    status: 'active',
  },
  {
    id: 6,
    title: 'Cấu trúc dữ liệu',
    author: 'Nguyễn Văn F',
    category: 'Lập trình',
    status: 'active',
  },
];

// ===============================
// PROPS CHO STATUS BUTTON
// ===============================

interface StatusProps {
  active: boolean;
  onChange: () => void;
}

// ===============================
// COMPONENT STATUS BUTTON
// ===============================

function StatusButton({
  active,
  onChange,
}: StatusProps) {
  return (
    <Pressable
      style={[
        styles.statusButton,
        active
          ? styles.activeButton
          : styles.inactiveButton,
      ]}
      onPress={onChange}
    >
      <Text style={styles.statusText}>
        {active ? 'active' : 'inactive'}
      </Text>
    </Pressable>
  );
}

// ===============================
// PROPS CHO BOOK ITEM
// ===============================

interface BookProps {
  title: string;
  author: string;
  category: string;
  active: boolean;
  onChange: () => void;
}

// ===============================
// COMPONENT SÁCH QUẢN LÝ
// ===============================

function BookItem({
  title,
  author,
  category,
  active,
  onChange,
}: BookProps) {
  return (
    <View style={styles.bookCard}>

      <Text style={styles.bookTitle}>
        {title}
      </Text>

      <Text style={styles.info}>
        Tác giả: {author}
      </Text>

      <Text style={styles.info}>
        Thể loại: {category}
      </Text>

      <StatusButton
        active={active}
        onChange={onChange}
      />

    </View>
  );
}

// ===============================
// PROPS CHO DISPLAY BOOK
// ===============================

interface DisplayBookProps {
  title: string;
  author: string;
  category: string;
}

// ===============================
// COMPONENT SÁCH HIỂN THỊ
// ===============================

function DisplayBook({
  title,
  author,
  category,
}: DisplayBookProps) {
  return (
    <View style={styles.displayCard}>

      <Text style={styles.displayTitle}>
        {title}
      </Text>

      <Text style={styles.info}>
        Tác giả: {author}
      </Text>

      <Text style={styles.info}>
        Thể loại: {category}
      </Text>

      <Text style={styles.displayStatus}>
        active
      </Text>

    </View>
  );
}

// ===============================
// COMPONENT CHÍNH
// ===============================

export default function HomeScreen() {

  // ==================================
  // LƯU ID CỦA NHỮNG SÁCH INACTIVE
  // ==================================

  const [inactiveBooks, setInactiveBooks] =
    useState<number[]>([]);

  // ==================================
  // ĐỔI TRẠNG THÁI TỪNG SÁCH
  // ==================================

  const changeStatus = (id: number) => {

    setInactiveBooks((current) => {

      // Nếu sách đang inactive
      // thì chuyển lại active

      if (current.includes(id)) {

        return current.filter(
          (bookId) => bookId !== id
        );
      }

      // Nếu sách đang active
      // thì thêm ID vào danh sách inactive

      return [...current, id];
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >

      {/* ==================================
          TIÊU ĐỀ
      ================================== */}

      <Text style={styles.heading}>
        Quản lý thư viện
      </Text>


      {/* ==================================
          DANH SÁCH QUẢN LÝ
      ================================== */}

      <Text style={styles.sectionTitle}>
        1. Danh sách quản lý
      </Text>

      {books.map((book) => {

        // Kiểm tra sách hiện tại có inactive không

        const isActive =
          !inactiveBooks.includes(book.id);

        return (
          <BookItem
            key={book.id}
            title={book.title}
            author={book.author}
            category={book.category}
            active={isActive}
            onChange={() =>
              changeStatus(book.id)
            }
          />
        );
      })}


      {/* ==================================
          DANH SÁCH HIỂN THỊ
      ================================== */}

      <Text style={styles.sectionTitle}>
        2. Danh sách hiển thị
      </Text>

      {books
        .filter(
          (book) =>
            !inactiveBooks.includes(book.id)
        )
        .map((book) => (

          <DisplayBook
            key={book.id}
            title={book.title}
            author={book.author}
            category={book.category}
          />

        ))}


      {/* ==================================
          KHI KHÔNG CÒN SÁCH ACTIVE
      ================================== */}

      {books.filter(
        (book) =>
          !inactiveBooks.includes(book.id)
      ).length === 0 && (

        <View style={styles.emptyBox}>

          <Text style={styles.emptyText}>
            Không có sách active
          </Text>

          <Text style={styles.emptySubText}>
            Tất cả sách đang inactive
          </Text>

        </View>

      )}

    </ScrollView>
  );
}

// ===============================
// STYLE
// ===============================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  // ==================================
  // TIÊU ĐỀ
  // ==================================

  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  // ==================================
  // TIÊU ĐỀ DANH SÁCH
  // ==================================

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },

  // ==================================
  // CARD QUẢN LÝ
  // ==================================

  bookCard: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  info: {
    fontSize: 15,
    marginBottom: 5,
  },

  // ==================================
  // NÚT STATUS
  // ==================================

  statusButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },

  activeButton: {
    backgroundColor: '#4CAF50',
  },

  inactiveButton: {
    backgroundColor: '#999',
  },

  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // ==================================
  // CARD HIỂN THỊ
  // ==================================

  displayCard: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  displayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  displayStatus: {
    marginTop: 8,
    fontWeight: 'bold',
  },

  // ==================================
  // KHÔNG CÒN SÁCH
  // ==================================

  emptyBox: {
    backgroundColor: '#eeeeee',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },

  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  emptySubText: {
    fontSize: 15,
    marginTop: 5,
  },
});